# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — run the server from TypeScript source with hot execution via `tsx` (no build step).
- `npm run build` — compile `src/` to `dist/` with `tsc`.
- `npm start` — run the compiled output (`node dist/index.js`); requires `npm run build` first.

The server listens on port **8080** (hardcoded in [src/index.ts](src/index.ts)).

No test runner or linter is configured — `npm test` is a placeholder that exits with an error.

## Architecture

A REST API for two CRUD resources — **airports** and **flights** — built on Express 5 with all data held **in memory only** (no database, by design; data is lost on restart). The original requirements are in [specs.md](specs.md).

The codebase enforces a strict layering (`controllers → services → store`) where the store is the single source of truth and integrity authority:

- **[src/store.ts](src/store.ts)** — the in-memory "database". The `airports`/`flights` `Map`s and the `nextFlightId` counter are **module-private**; the only way to read or mutate state is through the exported functions. This makes the integrity rules impossible to bypass from a controller. All business rules live here, not in the controllers.

- **[src/controllers/](src/controllers/)** — `airport.controller.ts` and `flight.controller.ts` are thin Express routers. Each route delegates to its **service** and wraps the call in `try/catch` that forwards errors to `handleError`. Controllers own only HTTP concerns — request parsing/validation (`Number(id)`, `req.body` casts) and response formatting (status codes, `res.json`). They contain no business logic and never touch the store directly. Mounted at `/airports` and `/flights` in [src/index.ts](src/index.ts).

- **[src/services/](src/services/)** — `airport.service.ts` and `flight.service.ts` are a thin delegation seam between the controllers and the store. Each function maps 1:1 to a store function and simply forwards the call (and lets store errors propagate). Services hold no validation, no formatting, and no business rules — they exist so controllers never import the store directly.

- **[src/errors.ts](src/errors.ts)** — defines domain error classes (`NotFoundError` → 404, `ConflictError` → 409, `IntegrityError` → 400) and the shared `handleError(err, res)` that maps them to HTTP responses (unknown errors → 500). The store *throws* these; controllers *catch* and translate them. This is the contract between the two layers.

- **[src/types.ts](src/types.ts)** — shared `Airport`, `Flight`, and `AirportCode` domain types, plus the `AirportInput`/`FlightInput` client-input types (used by services and controllers).

### Invariants the store enforces (preserve these when editing)

- **`futureFlights` is computed, never stored or client-set.** Airports are stored with an empty `futureFlights`; on every read, `view()` recomputes it as the flights departing from that airport whose `dateTimeDeparture` is strictly after `Date.now()`. The `*Input` types (`Omit<Airport, "futureFlights">`, `Omit<Flight, "id">`) exclude server-owned fields from client input.
- **Flight IDs are server-assigned and monotonic** (`nextFlightId++`); never reused after delete. Any client-supplied `id` is ignored.
- **Referential integrity:** creating/updating a flight requires both `source` and `destination` airports to exist (else `IntegrityError`). An airport cannot be deleted while any flight references it (else `ConflictError`). Creating a duplicate airport code is a `ConflictError`.
- **Airport `code` is identity:** on `updateAirport`, the path param `code` wins over any `code` in the body.

## Conventions

- TypeScript is `strict`; modules use ESM-style `import`/`export` syntax compiled to CommonJS (`module: NodeNext`, `type: commonjs` in package.json). Source under `src/`, output under `dist/` — never hand-edit `dist/`.
- Controllers import their service as `import * as airportService from "../services/airport.service"` and call it as `airportService.createAirport(...)` etc. The **services** are what import the store as `import * as db from "../store"`.
- Keep controllers logic-free: any new validation or business rule belongs in `store.ts` and should signal failure by throwing one of the `errors.ts` classes so `handleError` can map it. Keep services as pure pass-throughs (no validation, no formatting, no `try/catch`) so domain errors propagate to the controller.
