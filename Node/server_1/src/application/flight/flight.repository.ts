import { AirportCode } from "../../domain/airport/airport";
import { Flight, FlightInput } from "../../domain/flight/flight";

// Thin persistence port for the Flight aggregate. Speaks only domain types.
// Lookups return null when absent; mutators assume the use case has already
// checked preconditions (existence / both endpoint airports exist).
export interface IFlightRepository {
    listFlights(): Promise<Flight[]>;
    // Every flight departing from the given airport (no time filter). Unknown codes yield [].
    flightsFrom(source: AirportCode): Promise<Flight[]>;
    findById(id: number): Promise<Flight | null>;
    insertFlight(input: FlightInput): Promise<Flight>;
    updateFlight(id: number, input: FlightInput): Promise<Flight>;
    deleteFlight(id: number): Promise<void>;
    // Upcoming departures (dateTimeDeparture strictly after now) from the given airport.
    // Used to compose Airport.futureFlights inside the airport read use cases.
    listUpcomingByAirport(code: AirportCode): Promise<Flight[]>;
    // True if ANY flight (past or future) references the airport as source OR
    // destination. Used by DeleteAirport to block deleting a referenced airport.
    existsReferencing(code: AirportCode): Promise<boolean>;
}
