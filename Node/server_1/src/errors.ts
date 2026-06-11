import type { Response } from "express"; // type-only: keeps this module free of a runtime Express dependency

// Typed domain errors thrown by the database module (store.ts).
export class NotFoundError extends Error {} // -> 404
export class ConflictError extends Error {} // -> 409 (duplicate code, or airport still referenced)
export class IntegrityError extends Error {} // -> 400 (flight references an unknown airport)

// Shared mapping used by each controller's catch block to turn a domain error into a response.
export function handleError(err: unknown, res: Response): Response {
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
  if (err instanceof IntegrityError) return res.status(400).json({ error: err.message });
  return res.status(500).json({ error: "Internal server error" });
}
