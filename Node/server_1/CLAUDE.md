# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A REST API for two CRUD resources — **airports** and **flights** — built on Express 5 + Prisma 7 (SQLite via the `better-sqlite3` driver adapter). The original assignment is in [specs.md](specs.md); [openapi.yaml](openapi.yaml) documents the HTTP contract. The project is a deliberate refactor exercise: it carries a full Clean-Architecture layering far heavier than the CRUD itself warrants — that structure *is* the point, so preserve it.

> The repository root (`../../`) also contains unrelated standalone TypeScript exercise scripts (`Node/*.ts`, `Node/example/`). This project is self-contained under `Node/server_1/`; all paths below are relative to it.

## Commands

- **First-time / post-clone setup (required):** `npm install` then `npm run prisma:generate`. The Prisma client is generated into [src/generated/prisma](src/generated/prisma) which is **gitignored** — nothing compiles or runs until you generate it. Run `npm run prisma:migrate` to create/sync `dev.db`.
- `npm run dev` — run from TypeScript source via `tsx` (no build step). Server listens on port **8080** (hardcoded in [src/index.ts](src/index.ts)).
- `npm run build` — compile `src/` → `dist/` with `tsc`. `npm start` runs `dist/index.js` (build first; never hand-edit `dist/`).
- `npm run prisma:generate` / `prisma:migrate` / `prisma:studio` — wrap the Prisma CLI. After editing [prisma/schema.prisma](prisma/schema.prisma) you must re-run generate (and usually migrate).
- **No test runner and no linter are configured** — `npm test` is a placeholder that exits 1.

Env: `DATABASE_URL` (in `.env`, defaults to `file:./dev.db`) is read by both [src/prisma.ts](src/prisma.ts) (runtime) and [prisma.config.ts](prisma.config.ts) (CLI) via `dotenv`.

## Architecture

Strict layered / Clean Architecture. A request flows **controller → use case → repository → (Prisma | in-memory)**, and dependencies point inward: use cases depend on repository *interfaces*, never on a concrete store or on Prisma. Each resource lives in its own folder (`airports/`, `flights/`) with the same internal shape.

- **Domain (no dependencies):** [src/types.ts](src/types.ts) (`Airport`, `Flight`, and the write types `AirportInput` / `FlightInput`), [src/errors.ts](src/errors.ts), [src/use-case.ts](src/use-case.ts) (`UseCase<TInput, TOutput>`), [src/request-context.ts](src/request-context.ts).

- **Use cases** (`<resource>/use-cases/`): one class per operation implementing `UseCase`, in its own folder with a `types/` subdir holding the `*Input` / `*Output` interfaces. The bundle factory (`use-cases/index.ts`, e.g. `createAirportUseCases`) constructs them with repositories injected. Use cases receive repository **interfaces** in their constructor.

- **Repositories** (`<resource>/repository/`): an interface (`IAirportRepository`, `IFlightRepository`) with **two implementations** — `Prisma<Resource>Repository` (production, wired in `index.ts`) and the single `InMemoryRepository` in [src/database.ts](src/database.ts) (implements *both* interfaces; the test double / reference impl). Repositories speak **domain types only**.

- **Mappers** (`<resource>/repository/<resource>.mapper.ts`): the *only* place the domain↔Prisma-schema mismatch lives, used exclusively by the Prisma repositories. Keep all translation here — currently: Airport domain `code` ↔ schema `id`; Flight domain ISO-`string` dates ↔ schema `DateTime`.

- **HTTP layer:** controllers (`<resource>.controller.ts`) are `createXRouter(useCases)` factories that own *only* HTTP concerns — validate the request, assemble the use-case input, shape the response. Each route: `validate(dto)` middleware → `validated<typeof dto>(res)` to read the parsed payload → `uc.X.execute(...)` → response DTO → `res.json`. Every handler wraps the call in `try/catch` forwarding to `handleError`.

- **Composition root:** [src/index.ts](src/index.ts) — the only place that news up the `PrismaClient` ([src/prisma.ts](src/prisma.ts)), the Prisma repositories, the use-case bundles, and the routers, then seeds airports before `listen`. No IoC container; wiring is explicit.

### Conventions that span files (follow these)

- **Use-case I/O shape:** every use-case input is `{ context: RequestContext; data: <payload> }`. Route identifiers (`:code`, `:id`) go in `data`; ambient request metadata (auth/tracing, currently empty) goes in `context`. Outputs are named objects (e.g. `{ airport }`, `{ flight }`, `{ flights }`).
- **Validation (Zod) lives at the HTTP edge.** Per-endpoint DTO bundles (`{ params?, query?, body? }` of Zod schemas) live in `<resource>/dto/`; field schemas are shared via `<resource>.schema.ts`. The `validate()` middleware ([src/http/validation.ts](src/http/validation.ts)) parses and stores results on `res.locals.validated` — **not** on `req.params`/`req.query`, which are read-only getters in Express 5. Read them back type-safely with `validated<typeof someDto>(res)`.
- **Response DTOs** (`<resource>-response.dto.ts`, `toXResponse`) are an explicit wire contract — return these, never the raw domain entity, so internal fields can't leak.
- **Error contract:** repositories *throw* the domain errors from [src/errors.ts](src/errors.ts); `handleError` is the single place that maps them to HTTP — `NotFoundError`→404, `ConflictError`→409, `IntegrityError`→400, `ValidationError`/`ZodError`→400 (with per-field issues), anything else→500. New rules should throw one of these, not build a response.

### Invariants to preserve when editing

- **`Airport.futureFlights` is a computed view, never persisted and never client-set.** It is optional on the entity; repositories return airports *without* it. The airport *read* use cases compose it by calling `IFlightRepository.listUpcomingByAirport(code)` (departures strictly after "now"). Don't add it to the schema or the write types.
- **Flight `id` is server-assigned** (`autoincrement` / monotonic in-memory, never reused). `FlightInput` = `Omit<Flight,"id">`, so any client-sent `id` is dropped at the schema.
- **Airport `code` is identity.** On update, the path-param `code` wins over any `code` in the body (see `toUpdateAirportData`); the mapper never patches it.
- **Cross-aggregate referential integrity** (enforced inside the repositories, which hold/see both tables): creating or updating a flight requires both `source` and `destination` airports to exist (else `IntegrityError`); an airport cannot be deleted while any flight references it (else `ConflictError`); a duplicate airport code is a `ConflictError`. When changing persistence, keep both endpoints (Prisma + in-memory) behaviorally identical.

### Startup seed

[src/airports/airport-import.job.ts](src/airports/airport-import.job.ts) downloads the public OpenFlights dataset at boot and upserts **Italian airports only** (IATA code is the key; rows without one are skipped). It runs through the use cases, is idempotent, and is **non-fatal** — a fetch/parse failure is logged and the server still boots with an empty store.
