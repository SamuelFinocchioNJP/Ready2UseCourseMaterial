// Ambient per-request metadata passed as the `context` half of every use case
// input. Minimal today; this is the seam for auth/tracing later. Route params
// are NOT here — those belong in each use case's `data`.
export interface RequestContext {
  requestId?: string;
  // user?: AuthenticatedUser;  // reserved for future auth
}
