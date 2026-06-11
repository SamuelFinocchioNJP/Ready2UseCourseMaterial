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
  futureFlights: Flight[];
}

// Client input shapes: server-owned fields are excluded.
export type AirportInput = Omit<Airport, "futureFlights">; // futureFlights is computed, never client-set
export type FlightInput = Omit<Flight, "id">; // id is server-assigned
