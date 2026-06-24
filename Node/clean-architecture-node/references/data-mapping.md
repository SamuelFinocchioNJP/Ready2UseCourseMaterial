# Data mapping: creating vs reconstituting entities

The Data Mapper pattern (Fowler, *PoEAA*) moves data between domain objects and a persistence
representation while keeping the two independent of each other. The domain entity has no
knowledge of the database; the mapper does the translation, in both directions.

## Two lifecycle events, two constructors

The distinction that unlocks everything: an entity has two moments in its lifecycle —
**creation** and **reconstitution** — and they need different constructors.

- `create(...)` is a **domain factory**: it applies creation invariants, generates the
  identity, and fixes timestamps. The use case calls it when something new is born.
- `reconstitute(...)` (a.k.a. `fromPersistence`, `rehydrate`) **trusts** the data: it rebuilds
  state without regenerating the id, resetting `createdAt`, or re-running checks that might
  reject already-valid legacy data. The **mapper** calls it when loading from the DB.

Using the creation factory to rehydrate from the database is a classic bug — regenerated ids,
reset timestamps, spurious validation failures on old rows.

```ts
// domain/user/user.ts  (zero external imports)
export class User {
  private constructor(
    readonly id: UserId,
    readonly email: Email,
    private readonly passwordHash: string,
    readonly createdAt: Date,
  ) {}

  static create(props: { email: Email; passwordHash: string }): User {
    return new User(UserId.generate(), props.email, props.passwordHash, new Date());
  }

  static reconstitute(p: {
    id: UserId; email: Email; passwordHash: string; createdAt: Date;
  }): User {
    return new User(p.id, p.email, p.passwordHash, p.createdAt);
  }

  // flat snapshot: basis for BOTH persistence and output DTOs
  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
    };
  }
}
```

## The mapper lives in infrastructure

The Data Mapper sits in `infrastructure/`, next to the repository. It may depend on **both**
the domain entity **and** the Prisma types — and that is fine, because infrastructure depends
inward. The domain, conversely, must never know the mapper or Prisma exist; all persistence
concerns are extracted out of the domain classes, and the mapper is precisely where they go.

```ts
// infrastructure/persistence/user.mapper.ts
import type { User as Row, Prisma } from "@prisma/client";
import { User } from "../../domain/user/user";
import { UserId } from "../../domain/user/user-id";
import { Email } from "../../domain/user/email";

export const UserMapper = {
  toDomain(row: Row): User {
    return User.reconstitute({
      id: UserId.of(row.id),
      email: Email.reconstitute(row.email),
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    });
  },
  toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return user.toPrimitives();
  },
};
```

- `toDomain(row)` — the read direction: a persistence record becomes a reconstituted entity
  (and its value objects). Bypasses the creation factory.
- `toPersistence(user)` — the write direction: the entity's flat snapshot becomes the row.
  Using `toPrimitives()` keeps the entity's internals (like `passwordHash`) encapsulated while
  still giving the mapper what it needs.

## Domain model vs persistence model

The anti-pattern to refuse: using Prisma-generated models **as** the domain entities. It
couples the entire domain to the ORM and violates the Dependency Rule. Keep a persistence
model (the Prisma types) and a domain model, and map between them.

The objection is "that is boilerplate." It is — but the *good* kind: keeping the two models
separate lets you ignore the persistence tool's limitations when writing business logic, and
with Prisma the mapping is almost always a trivial one-to-one. The payoff grows with domain
richness: value objects, one-to-many collections inside an aggregate, and references between
aggregates are exactly where a hand-written mapper saves you from contorting the domain to
fit the ORM.

## Aggregates and updates

For an aggregate, the object fetched from persistence (via `toDomain`) is a plain in-memory
domain object. An update is: fetch the aggregate → mutate it through its methods → hand it to
the repository's `save()`, which owns the choice of how that lands in the database. See
`type-contracts.md` for the repository contract.
