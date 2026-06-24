# Layers in depth

The conceptual depth on each layer, plus the two mechanisms that connect them — dependency
inversion and the composition root. The model and the type table live in `SKILL.md`; the code
for entities, use cases, and repositories lives in the references that own those concepts, and
is pointed to below rather than repeated.

## 1. Entities — `domain/`

Enterprise business rules: the concepts that would exist even without this particular
application. Domain objects carrying their own intrinsic logic and invariants, plus value
objects (`Email`, `Money`, `UserId`) that enforce their own validity. Pure TypeScript — no
import of Express, Prisma, Zod, or any decorator/ORM type. This is the most stable layer; it is
untouched when you swap the web framework or the database.

The entity exposes two constructors and a snapshot — `create()`, `reconstitute()`,
`toPrimitives()`. Those are a data-mapping concern; see `references/data-mapping.md`.

## 2. Use Cases — `application/`

Application business rules. One class per use case (`CreateUser`, `BookSlot`, `FilterTenders`).
A use case orchestrates entities and reaches the outside world **only** through ports it
declares itself (`UserRepository`, `EmailSender`, `Clock`). It defines *what* the application
does, not *how*; it never imports Express or a concrete repository, and dependencies arrive
through the constructor.

It is also the right place to **compose multiple entities** into one result, keeping the
entities themselves lean (a `GetAirportUseCase` returns an `AirportWithFlights` that merges the
`Airport` aggregate with a `Flight[]`, while the two stay ignorant of each other). For what a
use case takes and returns, see `references/type-contracts.md`.

## 3. Interface Adapters — `adapters/`

A set of adapters that convert data from the form convenient for use cases and entities to the
form convenient for an external agency (the web, the database) and back. Here live the
**controllers**, **presenters**, the request **schemas** (Zod), the boundary **mappers**
(schema output → command), and — depending on layout — the *implementations* of the ports.

A controller takes `req`, parses it into a clean command, invokes the use case, and shapes the
response; it depends on Express only for the `(req, res)` signature. For the controller with
Zod parsing and error translation, see `references/validation.md`.

## 4. Frameworks & Drivers — `frameworks/`, `infrastructure/`

The outermost ring: the replaceable details. Express itself, the Prisma client / ORM, HTTP
clients to third-party services, configuration. Ideally the choice of framework and database is
the *last* decision you make — the inner three layers can be designed and tested before any of
it exists. App setup, route definitions, middleware, and server bootstrap live here, along with
the **port implementations** (the Prisma repositories) and the **Data Mapper**
(`infrastructure/persistence/`).

## Dependency Inversion

When a use case needs to call outward — to persist, say — it must not name the concrete
implementation, or the Dependency Rule breaks. Instead the use case declares a port (an
interface living inward) and the outer layer implements it. The source-code dependency then
points from the implementation inward to the interface — opposite to the runtime flow of
control. That inversion is what keeps the core stable while the details change. The full
`UserRepository` port and its Prisma implementation are in `references/type-contracts.md`.

## The composition root

Build the dependency graph in exactly one place, near the Express bootstrap. Manual constructor
injection is idiomatic and keeps the graph explicit and readable; an IoC container is optional.

```ts
// frameworks/express/composition-root.ts
export function buildContainer(db: PrismaClient) {
  const users = new PrismaUserRepository(db);            // concrete impl
  const createUser = new CreateUserUseCase(users);       // inject port impl
  const userController = new UserController(createUser);  // inject use case
  return { userController };
}
```

```ts
// frameworks/express/app.ts
export function createApp(db: PrismaClient) {
  const app = express();
  app.use(express.json());
  const { userController } = buildContainer(db);
  app.post("/users", userController.create);             // bind controller to route
  return app;
}
```
