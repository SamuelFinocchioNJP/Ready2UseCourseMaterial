import { FlightDelay } from "../../../domain/flight-delay/flight-delay";

// What the API exposes for a flight delay. An explicit wire contract (rather than
// returning the domain entity directly) so internal-only fields can never leak.
export interface FlightDelayResponseDto {
  id: number;
  flightId: number;
  dateTimeDeparture: string;
  dateTimeLanding: string;
  reason: string;
  createdAt: string;
}

export function toFlightDelayResponse(delay: FlightDelay): FlightDelayResponseDto {
  return {
    id: delay.id,
    flightId: delay.flightId,
    dateTimeDeparture: delay.dateTimeDeparture,
    dateTimeLanding: delay.dateTimeLanding,
    reason: delay.reason,
    createdAt: delay.createdAt,
  };
}

export function toFlightDelayListResponse(delays: FlightDelay[]): FlightDelayResponseDto[] {
  return delays.map(toFlightDelayResponse);
}
