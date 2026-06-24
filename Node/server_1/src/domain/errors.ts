// Typed domain errors raised by the use case layer and mapped to HTTP status codes
// at the edge (see adapters/http/http-error.ts).
export class NotFoundError extends Error {} // -> 404
export class ConflictError extends Error {} // -> 409 (duplicate code, or airport still referenced)
export class IntegrityError extends Error {} // -> 400 (flight references an unknown airport)
