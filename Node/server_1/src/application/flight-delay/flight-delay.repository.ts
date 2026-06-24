import { FlightDelay, FlightDelayInput } from "../../domain/flight-delay/flight-delay";

// Thin persistence port for the FlightDelay aggregate. Speaks only domain types.
// Lookups return null when absent; mutators assume the use case has already
// checked preconditions (the referenced flight exists).
export interface IFlightDelayRepository {
  listDelays(): Promise<FlightDelay[]>;
  // A flight's delay history, oldest first (createdAt asc). Unknown ids yield [].
  delaysForFlight(flightId: number): Promise<FlightDelay[]>;
  findById(id: number): Promise<FlightDelay | null>;
  insertDelay(input: FlightDelayInput): Promise<FlightDelay>;
  deleteDelay(id: number): Promise<void>;
}
