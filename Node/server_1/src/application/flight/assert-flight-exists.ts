import { IFlightRepository } from "./flight.repository";
import { IntegrityError } from "../../domain/errors";

// Referential integrity for flight-child aggregates (delays, reroutes): the
// referenced flight must exist. An unknown flightId in a request body is a
// referential-integrity violation -> IntegrityError (400), mirroring how an
// unknown airport is handled when creating a flight.
export async function assertFlightExists(
  flights: IFlightRepository,
  flightId: number
): Promise<void> {
  if ((await flights.findById(flightId)) === null) {
    throw new IntegrityError(`Unknown flight ${flightId}`);
  }
}
