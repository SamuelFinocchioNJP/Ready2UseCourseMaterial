import type { AirportCode } from "../airport/airport";

export interface Flight {
  id: number;
  source: AirportCode;
  destination: AirportCode;
  dateTimeDeparture: string;
  dateTimeLanding: string;
  airline: string;
  flightNumber: string;
}

// Domain write type for flights: id is server-assigned, so it is excluded.
export type FlightInput = Omit<Flight, "id">;
