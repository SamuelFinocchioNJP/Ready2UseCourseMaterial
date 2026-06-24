# Type contracts: use cases and repositories

One thread runs through every contract: **domain types are the currency of the inner layers;
persistence types (Prisma) and transport types (HTTP DTOs) stay confined to the two edges.**
The mapper is the seam between them.

## What a use case takes and returns

**Input** — a `Command` (for writes) or a `Query` (for reads): a flat object **owned by
`application/`**, made of primitives or value objects. Never `req`, never the HTTP DTO, never
an entity. It is the application's input contract — the thing the boundary mapper produces
from the validated Zod output.

**Output** — an **Output DTO** (response model), also owned by `application/`, **not the live
entity**. Wrap it in a `Result<Output, DomainError>` so the failure case is a domain error,
not a transport exception.

```ts
// application/user/create-user.result.ts  (output DTO, application-owned)
export interface CreateUserResult {
  id: string;
  email: string;
  createdAt: string; // ISO, already serializable
}
```

```ts
// application/user/create-user.usecase.ts
async execute(cmd: CreateUserCommand): Promise<Result<CreateUserResult, DomainError>> {
  const email = Email.create(cmd.email);
  if (await this.users.findByEmail(email)) return err(new EmailAlreadyInUse(email.value));
  const user = User.create({ email, passwordHash: await hash(cmd.plainPassword) });
  await this.users.save(user);
  const { id, email: e, createdAt } = user.toPrimitives();
  return ok({ id, email: e, createdAt: createdAt.toISOString() });
}
```

The entity → output mapping happens here, in `application/`, because the output DTO is the
application's. The controller then does the final hop, output DTO → HTTP response (the
presenter).

## DTO or entity? — the decision

Canonically, only simple data structures cross a boundary; you do **not** pass entities or
database rows outward (Robert C. Martin, *Clean Architecture*). So the orthodox default is:
the use case returns output data, not the entity.

But "must return a hand-written DTO" is too strong — it is a cost-driven choice, and Martin
himself frames boundaries as having a cost, with full / partial / ignored variants chosen per
project. The Dependency Rule by itself does **not** forbid returning an entity (the outer
layer is allowed to depend on the inner one); it is a guideline, not a derivable law.

Two things matter more than the label "DTO":

1. **What kind of thing crosses must be inert data, not a behavior-bearing object.** Whether
   that is a hand-written `CreateUserResult` or `entity.toPrimitives()`, the object's
   *methods* must not travel outward, so the controller cannot invoke domain behavior outside
   a use case.
2. **The real reason to separate output models from entities is change cadence, not
   serialization.** (The serialization argument — lazy-loading, JSON cycles — is a
   JPA/ORM-proxy problem we already avoid, because our entities are not ORM models.) Response
   models and entities change for *different reasons at different times*: the entity changes
   when domain rules change, the output changes when the API contract changes. Binding them
   couples independent axes of variation — a CCP/SRP violation.

### The heuristic

> **Will this output change for reasons different from the entity?**

- **Yes** — it composes several aggregates, adds view-only computed fields, or diverges from
  the domain shape → a **dedicated Output DTO**, hand-written in `application/`. This is also
  where you compose multiple entities (`AirportWithFlights` from an `Airport` aggregate and a
  `Flight[]`) instead of polluting entities with joined/computed fields.
- **No** — the output mirrors the aggregate → return `entity.toPrimitives()`. This is a
  **partial boundary**: an inert snapshot whose shape `application/` controls, with no
  separate type to keep in sync. If it later diverges, promote that point to a full DTO.

Either branch: never return the live entity with its methods.

## What a repository takes and returns

A repository is an **interface owned by `application/`** (a port); the Prisma implementation
lives in `infrastructure/`. The contract speaks **exclusively** in domain types — entities,
value objects, ids. Never a `Prisma.UserWhereInput`, never an ORM model in a signature; those
are implementation details.

```ts
// application/user/user.repository.ts  (port — domain types only)
export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
```

- `findById` returns `User | null` (or `Option<User>` if you use the ADT). Pair it with a
  `getById` variant that throws / returns `Result` with `NotFound` when absence is an error.
- Entity-centric / aggregate-oriented: one port per aggregate root, returning the fully
  reconstituted aggregate.
- `save(user)` decides insert vs update vs delete based on the aggregate's state — the use
  case only says "save this," it knows no SQL or upsert.

The Prisma ↔ domain conversion happens **inside** the implementation, via the Data Mapper:

```ts
// infrastructure/persistence/prisma-user.repository.ts
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const row = await this.db.user.findUnique({ where: { id: id.value } });
    return row ? UserMapper.toDomain(row) : null;          // Prisma -> domain
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.db.user.upsert({ where: { id: data.id }, create: data, update: data });
  }
  // findByEmail, delete ...
}
```

## The CQRS read-side exception

For complex **reads** that compose data (a joined `Airport` + `Flight` view), a dedicated
*read service* on the query side can return a read DTO built directly from the DB, **skipping**
entity reconstruction — avoiding the cost of rehydrating aggregates only to flatten them
again. This is the read side of a light CQRS: the command side stays entity-based as above;
the query side can go straight to the DTO. Keep them as two distinct ports so reporting
methods never pollute the entity-centric `UserRepository`.

In short: domain types in, domain types out, with the mapper as the only place Prisma is
named, and neither a live entity nor a `ZodError` crossing a boundary it does not belong to.
The boundary-by-boundary contract is the table in `SKILL.md`.
