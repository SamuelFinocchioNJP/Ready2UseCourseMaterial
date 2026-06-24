// A flight delay: an append-only record that the flight's schedule changed to a
// new departure/landing pair, with a free-text reason. Dates are ISO strings in
// the domain; `createdAt` is server-assigned at persistence time.
export interface FlightDelay {
  id: number;
  flightId: number;
  dateTimeDeparture: string; // new scheduled departure (ISO 8601)
  dateTimeLanding: string; // new scheduled landing (ISO 8601)
  reason: string;
  createdAt: string; // ISO 8601, server-assigned
}

// Domain write type: id and createdAt are server-assigned, so both are excluded.
export type FlightDelayInput = Omit<FlightDelay, "id" | "createdAt">;
