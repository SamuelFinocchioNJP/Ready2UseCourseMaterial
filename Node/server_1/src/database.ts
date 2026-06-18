import { Airport, AirportCode, AirportInput, Flight, FlightInput } from "./types";
import { ConflictError, IntegrityError, NotFoundError } from "./errors";

// The in-memory "database". All data is lost on restart, by design.
// The Maps and id counter are PRIVATE instance fields: the only way to read or
// mutate data is through the methods below, which enforce data integrity.
// This makes the integrity checks impossible to bypass from a controller.
// A single instance is created in index.ts and injected into every use case.
export class Database {
  private readonly airports = new Map<AirportCode, Airport>();
  private readonly flights = new Map<number, Flight>();
  private nextFlightId = 1; // monotonic: ids are never reused, even after a delete

  // Future-only projection: flights departing from this airport whose departure is
  // strictly after "now". Computed on read so it stays correct as the clock advances.
  private futureFlightsFor(code: AirportCode): Flight[] {
    const now = Date.now();
    return [...this.flights.values()].filter(
      (f) => f.source === code && Date.parse(f.dateTimeDeparture) > now
    );
  }

  // Build the response shape for an airport, overriding the stored (empty) futureFlights.
  private view(airport: Airport): Airport {
    return { ...airport, futureFlights: this.futureFlightsFor(airport.code) };
  }

  // Referential integrity: both endpoints of a flight must reference existing airports.
  private assertAirportsExist(source: AirportCode, destination: AirportCode): void {
    if (!this.airports.has(source)) throw new IntegrityError(`Unknown airport "${source}"`);
    if (!this.airports.has(destination)) throw new IntegrityError(`Unknown airport "${destination}"`);
  }

  // ---- Airports ----

  listAirports(): Airport[] {
    return [...this.airports.values()].map((a) => this.view(a));
  }

  getAirport(code: AirportCode): Airport {
    const airport = this.airports.get(code);
    if (!airport) throw new NotFoundError(`Airport "${code}" not found`);
    return this.view(airport);
  }

  createAirport(input: AirportInput): Airport {
    if (this.airports.has(input.code)) {
      throw new ConflictError(`Airport "${input.code}" already exists`);
    }
    const airport: Airport = { ...input, futureFlights: [] };
    this.airports.set(airport.code, airport);
    return this.view(airport);
  }

  updateAirport(code: AirportCode, input: AirportInput): Airport {
    if (!this.airports.has(code)) throw new NotFoundError(`Airport "${code}" not found`);
    const airport: Airport = { ...input, code, futureFlights: [] }; // code stays the path param
    this.airports.set(code, airport);
    return this.view(airport);
  }

  deleteAirport(code: AirportCode): Airport {
    const toDelete = structuredClone(this.airports.get(code));

    if (!toDelete) throw new NotFoundError(`Airport "${code}" not found`);

    const referenced = [...this.flights.values()].some(
      (f) => f.source === code || f.destination === code
    );

    if (referenced) {
      throw new ConflictError(`Airport "${code}" cannot be deleted while flights reference it`);
    }

    this.airports.delete(code);

    return toDelete;
  }

  // ---- Flights ----

  listFlights(): Flight[] {
    return [...this.flights.values()];
  }

  // Every flight departing from the given airport. Unknown/typo codes simply yield [].
  flightsFrom(source: AirportCode): Flight[] {
    return [...this.flights.values()].filter((f) => f.source === source);
  }

  getFlight(id: number): Flight {
    const flight = this.flights.get(id);
    if (!flight) throw new NotFoundError(`Flight ${id} not found`);
    return flight;
  }

  createFlight(input: FlightInput): Flight {
    this.assertAirportsExist(input.source, input.destination);
    const flight: Flight = { ...input, id: this.nextFlightId++ };
    this.flights.set(flight.id, flight);
    return flight;
  }

  updateFlight(id: number, input: FlightInput): Flight {
    if (!this.flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
    this.assertAirportsExist(input.source, input.destination);
    const flight: Flight = { ...input, id };
    this.flights.set(id, flight);
    return flight;
  }

  deleteFlight(id: number): void {
    if (!this.flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
    this.flights.delete(id);
  }
}
