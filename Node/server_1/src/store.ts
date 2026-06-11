import { Airport, AirportCode, Flight } from "./types";
import { ConflictError, IntegrityError, NotFoundError } from "./errors";

// The in-memory "database". All data is lost on restart, by design.
// The Maps and id counter are PRIVATE to this module: the only way to read or
// mutate data is through the exported methods below, which enforce data integrity.
// This makes the integrity checks impossible to bypass from a controller.

type AirportInput = Omit<Airport, "futureFlights">; // futureFlights is computed, never client-set
type FlightInput = Omit<Flight, "id">; // id is server-assigned

const airports = new Map<AirportCode, Airport>();
const flights = new Map<number, Flight>();
let nextFlightId = 1; // monotonic: ids are never reused, even after a delete

// Future-only projection: flights departing from this airport whose departure is
// strictly after "now". Computed on read so it stays correct as the clock advances.
function futureFlightsFor(code: AirportCode): Flight[] {
  const now = Date.now();
  return [...flights.values()].filter(
    (f) => f.source === code && Date.parse(f.dateTimeDeparture) > now
  );
}

// Build the response shape for an airport, overriding the stored (empty) futureFlights.
function view(airport: Airport): Airport {
  return { ...airport, futureFlights: futureFlightsFor(airport.code) };
}

// Referential integrity: both endpoints of a flight must reference existing airports.
function assertAirportsExist(source: AirportCode, destination: AirportCode): void {
  if (!airports.has(source)) throw new IntegrityError(`Unknown airport "${source}"`);
  if (!airports.has(destination)) throw new IntegrityError(`Unknown airport "${destination}"`);
}

// ---- Airports ----

export function listAirports(): Airport[] {
  return [...airports.values()].map(view);
}

export function getAirport(code: AirportCode): Airport {
  const airport = airports.get(code);
  if (!airport) throw new NotFoundError(`Airport "${code}" not found`);
  return view(airport);
}

export function createAirport(input: AirportInput): Airport {
  if (airports.has(input.code)) {
    throw new ConflictError(`Airport "${input.code}" already exists`);
  }
  const airport: Airport = { ...input, futureFlights: [] };
  airports.set(airport.code, airport);
  return view(airport);
}

export function updateAirport(code: AirportCode, input: AirportInput): Airport {
  if (!airports.has(code)) throw new NotFoundError(`Airport "${code}" not found`);
  const airport: Airport = { ...input, code, futureFlights: [] }; // code stays the path param
  airports.set(code, airport);
  return view(airport);
}

export function deleteAirport(code: AirportCode): Airport {
  const toDelete = structuredClone(airports.get(code));

  if (!toDelete) throw new NotFoundError(`Airport "${code}" not found`);
  
  const referenced = [...flights.values()].some(
    (f) => f.source === code || f.destination === code
  );
  
  if (referenced) {
    throw new ConflictError(`Airport "${code}" cannot be deleted while flights reference it`);
  }
  
  airports.delete(code);
  
  return toDelete;
}

// ---- Flights ----

export function listFlights(): Flight[] {
  return [...flights.values()];
}

export function getFlight(id: number): Flight {
  const flight = flights.get(id);
  if (!flight) throw new NotFoundError(`Flight ${id} not found`);
  return flight;
}

export function createFlight(input: FlightInput): Flight {
  assertAirportsExist(input.source, input.destination);
  const flight: Flight = { ...input, id: nextFlightId++ };
  flights.set(flight.id, flight);
  return flight;
}

export function updateFlight(id: number, input: FlightInput): Flight {
  if (!flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
  assertAirportsExist(input.source, input.destination);
  const flight: Flight = { ...input, id };
  flights.set(id, flight);
  return flight;
}

export function deleteFlight(id: number): void {
  if (!flights.has(id)) throw new NotFoundError(`Flight ${id} not found`);
  flights.delete(id);
}
