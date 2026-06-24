import { Airport } from "../../types";
import { FlightResponseDto, toFlightResponse } from "../../flights/dto/flight-response.dto";

// What the API exposes for an airport. An explicit wire contract (rather than
// returning the domain entity directly) so internal-only fields can never leak.
export interface AirportResponseDto {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  // Computed view, present only on reads; mirrors Airport.futureFlights.
  futureFlights?: FlightResponseDto[];
}

export function toAirportResponse(airport: Airport): AirportResponseDto {
  return {
    code: airport.code,
    name: airport.name,
    city: airport.city,
    country: airport.country,
    timezone: airport.timezone,
    futureFlights: airport.futureFlights?.map(toFlightResponse),
  };
}

export function toAirportListResponse(airports: Airport[]): AirportResponseDto[] {
  return airports.map(toAirportResponse);
}
