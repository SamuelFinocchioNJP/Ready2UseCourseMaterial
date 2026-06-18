import { Airport, AirportCode, AirportInput, Flight, FlightInput } from "./types";
import { ConflictError, IntegrityError, NotFoundError } from "./errors";
import { IAirportRepository } from "./airports/repository/airport.repository.interface";
import { IFlightRepository } from "./flights/repository/flight.repository.interface";

// In-memory implementation of both aggregate repositories, backed by Maps.
// All data is lost on restart, by design. A single class holds both aggregates so
// the cross-aggregate integrity rules (a flight's airports must exist; an airport
// referenced by a flight cannot be deleted) stay enforceable in one place.
// This is the test double; the Prisma implementations are the production wiring.
//
// Note: airport reads return the bare entity WITHOUT `futureFlights`. The upcoming
// departures view is exposed via listUpcomingByAirport and composed by the use cases.
export class InMemoryRepository implements IAirportRepository, IFlightRepository {
  private readonly airports = new Map<AirportCode, Airport>();
  private readonly flights = new Map<number, Flight>();
  private nextFlightId = 1; // monotonic: ids are never reused, even after a delete

  // Referential integrity: both endpoints of a flight must reference existing airports.
  private assertAirportsExist(source: AirportCode, destination: AirportCode): void {
    if (!this.airports.has(source)) throw new IntegrityError(`Unknown airport "${source}"`);
    if (!this.airports.has(destination)) throw new IntegrityError(`Unknown airport "${destination}"`);
  }

  // ---- Airports ----

  async listAirports(): Promise<Airport[]> {
    return [...this.airports.values()].map((a) => ({ ...a }));
  }

  async getAirport(code: AirportCode): Promise<Airport> {
    const airport = this.airports.get(code);
    if (!airport) throw new NotFoundError(`Airport "${code}" not found`);
    return { ...airport };
  }

  async createAirport(input: AirportInput): Promise<Airport> {
    if (this.airports.has(input.code)) {
      throw new ConflictError(`Airport "${input.code}" already exists`);
    }
    const airport: Airport = { ...input };
    this.airports.set(airport.code, airport);
    return { ...airport };
  }

  async updateAirport(code: AirportCode, input: AirportInput): Promise<Airport> {
    if (!this.airports.has(code)) throw new NotFoundError(`Airport "${code}" not found`);
    const airport: Airport = { ...input, code }; // code stays the path param
    this.airports.set(code, airport);
    return { ...airport };
  }

  async deleteAirport(code: AirportCode): Promise<Airport> {
    const toDelete = this.airports.get(code);

    if (!toDelete) throw new NotFoundError(`Airport "${code}" not found`);

    const referenced = [...this.flights.values()].some(
      (f) => f.source === code || f.destination === code
    );

    if (referenced) {
      throw new ConflictError(`Airport "${code}" cannot be deleted while flights reference it`);
    }

    this.airports.delete(code);

    return { ...toDelete };
  }

  // ---- Flights ----

  async listFlights(): Promise<Flight[]> {
    return [...this.flights.values()].map((f) => ({ ...f }));
  }

  // Every flight departing from the given airport. Unknown/typo codes simply yield [].
  async flightsFrom(source: AirportCode): Promise<Flight[]> {
    return [...this.flights.values()].filter((f) => f.source === source).map((f) => ({ ...f }));
  }

  // Future-only projection: departures from this airport strictly after "now".
  // Computed on read so it stays correct as the clock advances.
  async listUpcomingByAirport(code: AirportCode): Promise<Flight[]> {
    const now = Date.now();
    return [...this.flights.values()]
      .filter((f) => f.source === code && Date.parse(f.dateTimeDeparture) > now)
      .map((f) => ({ ...f }));
  }

  async getFlight(id: number): Promise<Flight> {
    const flight = this.flights.get(id);
    if (!flight) throw new NotFoundError(`Flight ${id} not found`);
    return { ...flight };
  }

  async createFlight(input: FlightInput): Promise<Flight> {
    this.assertAirportsExist(input.source, input.destination);
    const flight: Flight = { ...input, id: this.nextFlightId++ };
    this.flights.set(flight.id, flight);
    return { ...flight };
  }

  async updateFlight(id: number, input: FlightInput): Promise<Flight> {
    if (!this.flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
    this.assertAirportsExist(input.source, input.destination);
    const flight: Flight = { ...input, id };
    this.flights.set(id, flight);
    return { ...flight };
  }

  async deleteFlight(id: number): Promise<void> {
    if (!this.flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
    this.flights.delete(id);
  }
}
