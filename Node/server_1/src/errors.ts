import type { Response } from "express"; // type-only: keeps this module free of a runtime Express dependency
import { ZodError } from "zod";

// Typed domain errors thrown by the repository layer.
export class NotFoundError extends Error {} // -> 404
export class ConflictError extends Error {} // -> 409 (duplicate code, or airport still referenced)
export class IntegrityError extends Error {} // -> 400 (flight references an unknown airport)

// Raised by the validation middleware when a request fails its Zod schema. Carries
// the ZodError so handleError can render the per-field issues. -> 400
export class ValidationError extends Error {
  constructor(public readonly zodError: ZodError) {
    super("Validation failed");
  }
}

// Renders a ZodError as a 400 with a flat list of { path, message } issues,
// alongside the same top-level `error` key every other response uses.
function badRequest(zodError: ZodError, res: Response): Response {
  return res.status(400).json({
    error: "Validation failed",
    details: zodError.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
}

// Shared mapping used by each controller's catch block (and the validation
// middleware) to turn an error into a response.
export function handleError(err: unknown, res: Response): Response {
  if (err instanceof ValidationError) return badRequest(err.zodError, res);
  if (err instanceof ZodError) return badRequest(err, res);
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
  if (err instanceof IntegrityError) return res.status(400).json({ error: err.message });
  return res.status(500).json({ error: "Internal server error" });
}
