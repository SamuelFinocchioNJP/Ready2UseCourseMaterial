import * as db from "../store";
import { Flight, FlightInput } from "../types";

// Thin delegation seam: the store holds all business rules and integrity checks.
// These functions exist so controllers never touch the store directly. No
// validation or response formatting belongs here.

export function listFlights(): Flight[] {
  return db.listFlights();
}

export function getFlight(id: number): Flight {
  return db.getFlight(id);
}

export function createFlight(input: FlightInput): Flight {
  return db.createFlight(input);
}

export function updateFlight(id: number, input: FlightInput): Flight {
  return db.updateFlight(id, input);
}

export function deleteFlight(id: number): void {
  db.deleteFlight(id);
}

// Every flight from the airport CODE

// Every flight to the airport CODE

// Every direct flight from aiport CODE_1 to airport CODE_2

// Every Path of multiple flights from aiport CODE_1 to airport CODE_2 using DFS and backtracking

