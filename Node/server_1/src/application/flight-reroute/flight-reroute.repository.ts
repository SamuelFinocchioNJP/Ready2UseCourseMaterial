import { AirportCode } from "../../domain/airport/airport";
import { FlightReroute, FlightRerouteInput } from "../../domain/flight-reroute/flight-reroute";

// Thin persistence port for the FlightReroute aggregate. Speaks only domain types.
// Lookups return null when absent; mutators assume the use case has already
// checked preconditions (the flight and the new destination airport exist).
export interface IFlightRerouteRepository {
  listReroutes(): Promise<FlightReroute[]>;
  // A flight's reroute history, oldest first (createdAt asc). Unknown ids yield [].
  reroutesForFlight(flightId: number): Promise<FlightReroute[]>;
  findById(id: number): Promise<FlightReroute | null>;
  insertReroute(input: FlightRerouteInput): Promise<FlightReroute>;
  deleteReroute(id: number): Promise<void>;
  // True if ANY reroute points to the airport as its new destination. Used by
  // DeleteAirport to block deleting an airport a reroute still references.
  existsReferencingDestination(code: AirportCode): Promise<boolean>;
}
