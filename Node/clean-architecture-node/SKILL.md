---
name: clean-architecture-node
description: >-
  Clean Architecture for Node/TypeScript backends on Express (with Prisma and Zod). Use when
  structuring, refactoring, or reviewing such a backend, or when the question is where
  validation belongs across the layers, how to create versus reconstitute entities and keep
  the domain model separate from the Prisma model, or what types use cases and repositories
  take and return — output DTO versus entity snapshot included. Triggers on "clean" or
  "hexagonal" architecture, "ports and adapters", "data mapper", or "DTO vs entity", and on
  these problems even when the architecture is never named. For Bun/ElysiaJS/Drizzle backends,
  defer to the Elysia-specific clean-architecture skill.
---

# Clean Architecture (Node + Express + TypeScript)

Principles are framework-independent; the code shows how they land with Express, Prisma, and
Zod. This file holds the model, the type contract, and the decision rules. Each rule names the
reference that carries its depth — open it when the task reaches that branch.

## The Dependency Rule

Source-code dependencies point only inward; nothing in an inner circle may name anything in an
outer one — not a class, a function, or a data format produced by an outer framework. The
runtime flow of control may run outward; the compile-time dependency never does. To call
outward, invert it: the inner layer declares a port, the outer layer implements it.

From it follows the thesis that settles most questions here:

> **Domain types (entities, value objects, ids) are the currency of the inner layers.
> Persistence types (Prisma) and transport types (HTTP DTOs) stay at the two outer edges.
> Mappers are the seams that keep them from touching.**

If `import { z }` or `import { PrismaClient }` ever appears inside `domain/` or `application/`,
that is the violation to fix.

## The four layers

Core outward — full treatment in `references/layers.md`:

1. **Entities** (`domain/`) — enterprise rules: domain objects with invariants, plus value objects. Pure TypeScript, zero external imports.
2. **Use Cases** (`application/`) — one class per use case; orchestrate entities, reach outward only through ports they declare. Define *what*, not *how*.
3. **Interface Adapters** (`adapters/`) — controllers, presenters, request schemas, boundary mappers, and the port implementations.
4. **Frameworks & Drivers** (`frameworks/`, `infrastructure/`) — the replaceable details: Express, Prisma, HTTP clients, config. **Express is a delivery mechanism**, nothing more.

The graph is wired once, in the **composition root** by the Express bootstrap — manual
constructor injection, no IoC container required (`references/layers.md`).

## The type contract

The type that crosses each boundary. This table is the single source for the contract:

| Boundary | Type that crosses |
| --- | --- |
| Transport → Adapter | HTTP DTO, validated by Zod |
| Adapter → Application | `Command` / `Query` — plain, application-owned |
| Application → Domain | command/primitives → **Entity** via a factory |
| Application ↔ Repository (port) | **domain types only** — entities, value objects, ids; never Prisma types |
| Repository impl ↔ DB | the Prisma model, bridged by the **Data Mapper** |
| Application → Adapter (return) | an Output DTO *or* an entity `toPrimitives()` snapshot — never the live entity |
| Adapter → Transport (return) | the HTTP response, shaped by a presenter |

## Decision rules

### 1. Where validation goes → `references/validation.md`

Three responsibilities, not one. **Shape** of untrusted input → the boundary (Zod
`safeParse`): *parse, don't validate* — turn `unknown` into a typed value; a `ZodError` is a
transport error, becomes a `400`, and never enters the domain. **Business rules** (uniqueness,
existence, authorization) → the use case. **Invariants** → entity and value-object
constructors, in pure TypeScript. The domain re-checks invariants even after Zod, because
non-HTTP entry points (worker, CLI, test) bypass the boundary.

### 2. Creating entities: create vs reconstitute → `references/data-mapping.md`

`create()` is a domain factory — applies creation invariants, generates the id, sets
timestamps; the use case calls it for something new. `reconstitute()` trusts persisted data
and rebuilds state without regenerating identity; the Data Mapper calls it when loading.
Rehydrating through the creation factory is a classic bug.

### 3. What a use case returns → `references/type-contracts.md`

Canonically a use case returns inert *output data*, never a live entity. The choice between a
hand-written DTO and a snapshot is cost-driven — decide by **change cadence**:

> **Will this output change for reasons different from the entity?**

**Yes** (it composes several aggregates, adds view-only fields, or diverges from the domain
shape) → a dedicated **Output DTO** in `application/` — also where you compose multiple
entities instead of fattening one. **No** (it mirrors the aggregate) → return
`entity.toPrimitives()`, a **partial boundary** with no second type to keep in sync. Either
way the object's *methods* never travel outward.

## Folder structure

```
src/
├── domain/                 # entities, value objects — zero external imports
│   └── user/
│       ├── user.ts         # create(), reconstitute(), toPrimitives()
│       ├── user-id.ts
│       └── email.ts
├── application/            # use cases + ports (interfaces) + commands + output DTOs
│   └── user/
│       ├── create-user.command.ts
│       ├── create-user.result.ts
│       ├── create-user.usecase.ts
│       └── user.repository.ts        # the PORT (domain types only)
├── adapters/               # controllers, presenters, schemas, boundary mappers
│   └── http/
│       └── user/
│           ├── user.controller.ts
│           ├── create-user.schema.ts # Zod
│           └── create-user.mapper.ts # schema output -> command
├── infrastructure/         # port IMPLEMENTATIONS + persistence
│   └── persistence/
│       ├── prisma-user.repository.ts
│       └── user.mapper.ts            # Data Mapper: toDomain / toPersistence
└── frameworks/             # Express app, routes, middleware, composition root
    └── express/
        ├── app.ts
        ├── validate.ts
        └── composition-root.ts
```

A smaller project may collapse to `domain`, `application`, `infrastructure` (adapters +
frameworks merged) — fine while the Dependency Rule holds.

## Anti-patterns to refuse

- Using Prisma-generated models **as** domain entities (couples the whole domain to the ORM).
- Importing Zod, Express, or Prisma anywhere inside `domain/` or `application/`.
- Passing a **live entity** across the use-case → adapter boundary.
- Re-running *shape* validation inside the use case (it was done at the boundary).
- Putting business **invariants** only in a Zod schema (non-HTTP entry points bypass it).
- Repository ports that expose Prisma types (`Prisma.UserWhereInput`, ORM models).
- Letting a `ZodError` reach the domain or leak out of the application.
