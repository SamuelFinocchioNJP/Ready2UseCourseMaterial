import { AirportCode, Flight, FlightInput } from "../../types";

// Entity-centric repository for the Flight aggregate. Speaks only domain types.
export interface IFlightRepository {
    listFlights(): Promise<Flight[]>;
    // Every flight departing from the given airport (no time filter). Unknown codes yield [].
    flightsFrom(source: AirportCode): Promise<Flight[]>;
    getFlight(id: number): Promise<Flight>;
    createFlight(input: FlightInput): Promise<Flight>;
    updateFlight(id: number, input: FlightInput): Promise<Flight>;
    deleteFlight(id: number): Promise<void>;
    // Upcoming departures (dateTimeDeparture strictly after now) from the given airport.
    // Used to compose Airport.futureFlights inside the airport read use cases.
    listUpcomingByAirport(code: AirportCode): Promise<Flight[]>;
}
