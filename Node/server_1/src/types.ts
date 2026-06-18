export type AirportCode = string;

export interface Flight {
  id: number;
  source: AirportCode;
  destination: AirportCode;
  dateTimeDeparture: string;
  dateTimeLanding: string;
  airline: string;
  flightNumber: string;
}

export interface Airport {
  code: AirportCode;
  name: string;
  city: string;
  country: string;
  timezone: string;
  // Computed view of upcoming departures, never intrinsic state and never persisted.
  // Composed by the use cases that need it (via IFlightRepository.listUpcomingByAirport);
  // repositories return airports without it, hence optional.
  futureFlights?: Flight[];
}

// Domain write type for airports: the persistable fields a client may set.
// Kept as a distinct named type even though it mirrors Airport minus the computed view.
export interface AirportInput {
  code: AirportCode;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

// Domain write type for flights: id is server-assigned, so it is excluded.
export type FlightInput = Omit<Flight, "id">;
