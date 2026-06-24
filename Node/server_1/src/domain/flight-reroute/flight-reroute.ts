import type { AirportCode } from "../airport/airport";

// A flight reroute: an append-only record that the flight was diverted to a new
// destination airport, with a free-text reason. `createdAt` is server-assigned.
export interface FlightReroute {
  id: number;
  flightId: number;
  newDestination: AirportCode; // FK -> Airport.code
  reason: string;
  createdAt: string; // ISO 8601, server-assigned
}

// Domain write type: id and createdAt are server-assigned, so both are excluded.
export type FlightRerouteInput = Omit<FlightReroute, "id" | "createdAt">;
