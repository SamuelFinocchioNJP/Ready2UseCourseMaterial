# Report Architetturale — `Node/server_1` (stato attuale)

> Report di sola analisi (fotografia dell'architettura corrente).
> Tutti i percorsi sono relativi a `Node/server_1/`.

## 1. Struttura delle cartelle

```
src/
├── index.ts                     # composition root / entrypoint Express
├── database.ts                  # persistenza ATTUALE: store in-memory (Map)
├── types.ts                     # entità di dominio (Airport, Flight, *Input)
├── errors.ts                    # tipi di errore
├── use-case.ts                  # interfaccia generica UseCase<TInput, TOutput>
├── request-context.ts          # RequestContext (seam per auth/tracing)
│
├── airports/
│   ├── airport.controller.ts
│   ├── airport-import.job.ts
│   ├── repository/                              # ⚠️ cartella UNTRACKED (WIP)
│   │   └── airport.repository.interface.ts      # solo interfaccia, nessuna impl.
│   └── use-cases/
│       ├── index.ts                             # wiring use case airports
│       ├── create-airport/
│       │   ├── create-airport.use-case.ts
│       │   └── types/
│       │       ├── create-airport-input.interface.ts
│       │       └── create-airport-output.interface.ts
│       ├── delete-airport/ | get-airport/ | list-airports/ | update-airport/
│
├── flights/
│   ├── flight.controller.ts
│   └── use-cases/
│       ├── index.ts                             # wiring use case flights
│       ├── create-flight/ | delete-flight/ | get-flight/
│       ├── list-flights/ | list-flights-from/ | update-flight/
│
├── crons/                       # vuota (riservata)
└── generated/prisma/            # client Prisma generato — NON usato dal codice
```

Mappatura sui layer Clean Architecture:
- **Dominio**: `types.ts`, `errors.ts`, `use-case.ts`
- **Applicazione (use case)**: `airports/use-cases/`, `flights/use-cases/`
- **Infrastruttura**: `database.ts` (in-memory), `generated/prisma/` (dormiente)
- **Interfaccia/HTTP**: `*.controller.ts`
- **Composition root**: `index.ts`

## 2. Stack e versioni

File: `package.json`

```json
"@prisma/client": "^7.8.0",
"@prisma/adapter-better-sqlite3": "^7.8.0",
"prisma": "^7.8.0",
"typescript": "^6.0.3",
"express": "^5.2.1",
"better-sqlite3": "^12.11.1",
"tsx": "^4.22.4"
```

- **Runtime**: Node.js (`"type": "commonjs"`), non Bun. Dev via `tsx`.
- **TypeScript**: 6.0.3
- **Prisma**: 7.8.0 (client + CLI), adapter `better-sqlite3` → SQLite.
- **HTTP**: Express 5.2.1.

## 3. Entità di dominio

Definite come `interface`/`type` (NON `class`) e centralizzate in un unico file.

File: `src/types.ts` — definizione **verbatim** dell'entità `Airport`:

```typescript
export type AirportCode = string;

export interface Airport {
  code: AirportCode;
  name: string;
  city: string;
  country: string;
  timezone: string;
  futureFlights: Flight[];
}

// Input lato client: i campi server-owned sono esclusi.
export type AirportInput = Omit<Airport, "futureFlights">; // futureFlights è calcolato
```

Import da `@prisma/client`? **NO.** Nessun file di dominio (né alcun file non generato) importa da `@prisma/client`. I tipi Prisma esistono solo in `src/generated/prisma/` ma non sono mai referenziati.

## 4. Use case

Struttura: classi che implementano `UseCase<TInput, TOutput>` (definito in `src/use-case.ts`) con metodo `execute`. Una cartella per use case; i tipi I/O vivono in un sottodirectory `types/` come file separati.

**Convenzione di naming**: `{NomeUseCase}Input` / `{NomeUseCase}Output`. L'input segue sempre la forma `{ context: RequestContext; data: <payload> }`.

### Use case A — CreateAirport

File tipi: `src/airports/use-cases/create-airport/types/create-airport-input.interface.ts`
```typescript
export interface CreateAirportInput {
  context: RequestContext;
  data: AirportInput;
}
```
File: `src/airports/use-cases/create-airport/types/create-airport-output.interface.ts`
```typescript
export interface CreateAirportOutput {
  airport: Airport;
}
```
Firma `execute` (in `create-airport.use-case.ts`):
```typescript
async execute({ data }: CreateAirportInput): Promise<CreateAirportOutput>
```

### Use case B — UpdateFlight

File: `src/flights/use-cases/update-flight/types/update-flight-input.interface.ts`
```typescript
export interface UpdateFlightInput {
  context: RequestContext;
  data: { id: number; flight: FlightInput };
}
```
File: `src/flights/use-cases/update-flight/types/update-flight-output.interface.ts`
```typescript
export interface UpdateFlightOutput {
  flight: Flight;
}
```
Firma `execute` (in `update-flight.use-case.ts`):
```typescript
async execute({ data }: UpdateFlightInput): Promise<UpdateFlightOutput>
```

Use case presenti: **Airports (5)** create/delete/get/list/update; **Flights (6)** create/delete/get/list/list-from/update.

## 5. Repository

- **Interfacce**: ne esiste **una sola**, per gli airport. Nessuna per i flight.
- **Implementazioni**: **nessuna** (nessuna classe implementa l'interfaccia).
- **Base generica** (`IRepository<T>` / `BaseRepository`): **non esiste**.
- **Tipi parlati**: solo **entità di dominio** (`Airport`, `AirportCode`, `AirportInput`). Nessun DTO, nessun tipo Prisma.

File **verbatim**: `src/airports/repository/airport.repository.interface.ts` (cartella untracked, WIP):
```typescript
import { Airport, AirportCode, AirportInput } from "../../types";

export interface IAirportRepository {
    listAirports(): Promise<Airport[]>;
    getAirport(id: AirportCode): Promise<Airport>;
    createAirport(input: AirportInput): Promise<Airport>;
    updateAirport(id: AirportCode, input: AirportInput): Promise<Airport>;
    deleteAirport(id: AirportCode): Promise<Airport>;
}
```
Nota: l'interfaccia non è ancora cablata da nessuna parte; gli use case ricevono `Database` direttamente, non `IAirportRepository`.

## 6. Mapper

**Non esiste** alcuno strato di mapping tra modelli Prisma ed entità di dominio (nessun file `*mapper*` / `*map.ts`, nessun pattern `toDomain`/`toPersistence`). Attualmente i tipi di dominio fluiscono direttamente dagli use case allo store in-memory `Database`, senza trasformazioni.

## 7. Prisma

- **Schema**: `prisma/schema.prisma`.
- **Generazione**: client custom in `src/generated/prisma` (`runtime = "nodejs"`), provider `sqlite`.
- **Modelli definiti (2)**: `Airport`, `Flight`. Verbatim di `Flight`:
```prisma
model Flight {
  id                Int      @id @default(autoincrement())
  source            String   // FK -> Airport.id
  destination       String   // FK -> Airport.id
  dateTimeDeparture DateTime
  dateTimeLanding   DateTime
  airline           String
  flightNumber      String
  sourceAirport      Airport @relation("DepartingFlights", fields: [source], references: [id])
  destinationAirport Airport @relation("ArrivingFlights", fields: [destination], references: [id])
}
```
- **Istanziazione `PrismaClient`**: **nessuna.** `PrismaClient` non viene mai istanziato né importato nel codice applicativo. La persistenza attuale è `src/database.ts`:
```typescript
export class Database {
  private readonly airports = new Map<AirportCode, Airport>();
  private readonly flights = new Map<number, Flight>();
  private nextFlightId = 1;
  // ...
}
```
- **Accesso attuale**: repository/use case **non** accedono a Prisma. Gli use case ricevono un'istanza singola di `Database` via costruttore e ne chiamano i metodi (es. `this.db.createAirport(data)`).

## 8. Wiring / composition root

Punto di composizione esplicito e manuale (nessun container IoC). File: `src/index.ts`:
```typescript
const db = new Database();
const airportUseCases = createAirportUseCases(db);
const flightUseCases = createFlightUseCases(db);

const app = express();
app.use(express.json());
app.use("/airports", createAirportsRouter(airportUseCases));
app.use("/flights", createFlightsRouter(flightUseCases));
```

Funzioni factory per dominio, es. `src/airports/use-cases/index.ts`:
```typescript
export function createAirportUseCases(db: Database): AirportUseCases {
  return {
    list: new ListAirportsUseCase(db),
    get: new GetAirportUseCase(db),
    create: new CreateAirportUseCase(db),
    update: new UpdateAirportUseCase(db),
    delete: new DeleteAirportUseCase(db),
  };
}
```

Iniezione nello use case (costruttore tipizzato sul concreto `Database`, non su un'astrazione):
```typescript
// src/airports/use-cases/create-airport/create-airport.use-case.ts
constructor(private readonly db: Database) {}
```
I bundle di use case vengono poi iniettati nei router (`createAirportsRouter(uc)`).

## 9. Incoerenze e lavori a metà

1. **Prisma installato ma non usato.** Schema + dipendenze + client generato presenti (aggiunti nel commit `0935c9c`), ma zero import da `@prisma/client` nel codice; la persistenza reale resta in-memory (`database.ts`).
2. **Repository abbozzato e non cablato.** Esiste `IAirportRepository` (cartella untracked), ma nessuna implementazione e nessun wiring; gli use case dipendono dal concreto `Database`, non dall'interfaccia → l'astrazione non porta ancora alcun beneficio.
3. **Asimmetria tra domini.** Solo gli airport hanno un'interfaccia repository; i flight no.
4. **Nessuna base generica.** Manca `IRepository<T>`/`BaseRepository`; ogni interfaccia ridefinisce a mano le firme CRUD.
5. **Nessun mapper / nessun DTO.** I tipi di dominio (`AirportInput`, `FlightInput`) fungono sia da input client sia da input persistenza.
6. **Disallineamenti dominio ↔ schema Prisma** (da gestire all'integrazione):
   - PK airport: dominio usa `code`, lo schema usa `id`.
   - Date flight: dominio le tipizza `string`, lo schema usa `DateTime`.
   - `Airport.futureFlights` (dominio, calcolato) vs relazioni `departingFlights`/`arrivingFlights` (schema).
7. **Documentazione stale.** `CLAUDE.md` cita `src/store.ts`, `src/services/`, `src/controllers/` non più esistenti (refactoring nei commit `139386e` / successivi).

---

## Nota sul punto decisionale

Allo stato attuale i confini sono **puliti**: entità e use case parlano solo tipi di dominio, e nessun tipo Prisma è ancora "colato" nei layer interni. La decisione su come tipizzare I/O dei repository è quindi ancora completamente aperta — l'unico vincolo già implicito è che l'interfaccia esistente (`IAirportRepository`) parla in **entità di dominio** (`Airport`/`AirportInput`), non in tipi Prisma.
