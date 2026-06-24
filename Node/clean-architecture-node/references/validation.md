# Validation with Zod

Zod is a detail, and details live in the outer rings. The Dependency Rule forbids `domain/`
and `application/` from importing it. So "validation" is not one operation in one place — it
is three responsibilities split across the layers, and Zod covers only the first.

The right mental model is **parse, don't validate**: take an `unknown`, untrusted input and
turn it into a typed, trusted value, so everything downstream is already safe. That is exactly
a controller's boundary job.

## The validation pipeline

```
req.body / params / query        (untrusted input)
        │  Zod safeParse — forma, tipi, campi richiesti        [adapter]
        ▼
typed command                    (trusted)
        │  business rules — uniqueness, existence, authorization  [use case]
        ▼
domain invariants                — constructors, value objects (pure TS) [entity]
```

- **Shape / type validation** → the boundary. Zod `safeParse` on the request. A `ZodError`
  is a *transport* error → translate to `400`. It must never enter or propagate from the domain.
- **Business rules** → the use case, in plain code, returning/throwing domain errors
  (mapped to `409`/`422`).
- **Invariants** → entity and value-object constructors, in pure TypeScript, no Zod.

## The schema and its type stay in the adapter

The Zod schema describes the *shape of the HTTP payload*, not the domain. Define it next to
the controller, with a pure **mapper** that converts the validated output into a command
whose type is owned by `application/`. The schema's inferred type must not leak inward;
do not make `z.infer` the domain type.

```ts
// adapters/http/user/create-user.schema.ts
import { z } from "zod";

export const CreateUserBody = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Almeno 8 caratteri" }),
  displayName: z.string().min(2).max(50),
});

export type CreateUserBody = z.infer<typeof CreateUserBody>; // confined to this layer
```

```ts
// application/user/create-user.command.ts  (no Zod — domain-owned type)
export interface CreateUserCommand {
  email: string;
  plainPassword: string;
  displayName: string;
}
```

```ts
// adapters/http/user/create-user.mapper.ts  (pure function)
export const toCreateUserCommand = (b: CreateUserBody): CreateUserCommand => ({
  email: b.email,
  plainPassword: b.password,
  displayName: b.displayName,
});
```

The near-duplication between schema and command is the *good* kind: the boundary acts as an
anti-corruption layer, so when the client renames a field you change only schema + mapper and
the domain never notices.

## Where `safeParse` runs: two options

### Option A (preferred) — explicit in the controller

Zod sits in the adapter, which is exactly where it belongs. Most explicit, no magic.

```ts
const parsed = CreateUserBody.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ errors: z.treeifyError(parsed.error) });
}
const result = await this.createUser.execute(toCreateUserCommand(parsed.data));
```

### Option B — a generic validation middleware

Declarative and keeps controllers dry, but it lives in `frameworks/`, is coupled to Express,
and mutates `req`. A stricter reading treats request validation as a use-case detail and
avoids middleware entirely; that is usually overkill for *shape* validation, which is
genuinely a transport concern. Choose the middleware when many routes share patterns,
the explicit form when you want zero magic in the graph.

```ts
// frameworks/express/validate.ts
import { z, type ZodType } from "zod";
import type { RequestHandler } from "express";

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: z.treeifyError(parsed.error) });
    }
    req.body = parsed.data; // now typed and trusted
    next();
  };
```

## Errors are transport errors

A `ZodError` never enters the domain and is never propagated from it — translate it to a
`400` at the boundary. Domain errors (`EmailAlreadyInUse`, `NotFound`) are a different thing:
they arise inside use cases and entities and map to their own status codes (`409`, `422`),
typically in a dedicated Express error handler that branches on the error type.

## The domain still re-validates invariants

The domain re-checks its own invariants in pure TypeScript even though Zod already validated
the shape. This is defense in depth with a precise rationale: the same use case can be
invoked from a queue worker, a CLI command, or a test — none of which pass through the
Express + Zod boundary. If invariants lived only in the schema, any non-HTTP entry point
could construct invalid entities. The schema is not the domain rule; the constructor is.

## Current Zod 4 idioms

The `zod` package root now exports v4. Use the current API:

- **Top-level string formats**: `z.email()`, `z.uuid()`, `z.url()` (the method forms
  `.email()` etc. are deprecated and more tree-shaking-hostile).
- **Unified error customization** under a single `error` param, replacing the old
  `message` / `required_error` / `invalid_type_error`: `z.string({ error: "..." })`,
  `z.string().min(8, { error: "..." })`.
- **Error formatting** with the top-level `z.treeifyError(result.error)` (the `.flatten()`
  and `.format()` methods on `ZodError` are deprecated).
- **Query params** arrive as strings — coerce them: `z.coerce.number().int().positive()`.
- `safeParse` returns a discriminated `{ success: true, data } | { success: false, error }`,
  which pairs cleanly with a `Result`/`Either` style in the use case.
