import { FlightReroute } from "../../../domain/flight-reroute/flight-reroute";

// What the API exposes for a flight reroute. An explicit wire contract (rather than
// returning the domain entity directly) so internal-only fields can never leak.
export interface FlightRerouteResponseDto {
  id: number;
  flightId: number;
  newDestination: string;
  reason: string;
  createdAt: string;
}

export function toFlightRerouteResponse(reroute: FlightReroute): FlightRerouteResponseDto {
  return {
    id: reroute.id,
    flightId: reroute.flightId,
    newDestination: reroute.newDestination,
    reason: reroute.reason,
    createdAt: reroute.createdAt,
  };
}

export function toFlightRerouteListResponse(reroutes: FlightReroute[]): FlightRerouteResponseDto[] {
  return reroutes.map(toFlightRerouteResponse);
}
