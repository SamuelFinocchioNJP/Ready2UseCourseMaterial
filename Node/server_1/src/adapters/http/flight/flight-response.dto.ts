import { Flight } from "../../../domain/flight/flight";

// What the API exposes for a flight. An explicit wire contract (rather than
// returning the domain entity directly) so internal-only fields can never leak.
export interface FlightResponseDto {
  id: number;
  source: string;
  destination: string;
  dateTimeDeparture: string;
  dateTimeLanding: string;
  airline: string;
  flightNumber: string;
}

export function toFlightResponse(flight: Flight): FlightResponseDto {
  return {
    id: flight.id,
    source: flight.source,
    destination: flight.destination,
    dateTimeDeparture: flight.dateTimeDeparture,
    dateTimeLanding: flight.dateTimeLanding,
    airline: flight.airline,
    flightNumber: flight.flightNumber,
  };
}

export function toFlightListResponse(flights: Flight[]): FlightResponseDto[] {
  return flights.map(toFlightResponse);
}
