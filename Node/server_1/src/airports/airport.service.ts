import * as db from "../store";
import { Airport, AirportInput } from "../types";

// Thin delegation seam: the store holds all business rules and integrity checks.
// These functions exist so controllers never touch the store directly. No
// validation or response formatting belongs here.

export function listAirports(): Airport[] {
  return db.listAirports();
}

export function getAirport(code: string): Airport {
  return db.getAirport(code);
}

export function createAirport(input: AirportInput): Airport {
  return db.createAirport(input);
}

export function updateAirport(code: string, input: AirportInput): Airport {
  return db.updateAirport(code, input);
}

export function deleteAirport(code: string): Airport {
  return db.deleteAirport(code);
}
