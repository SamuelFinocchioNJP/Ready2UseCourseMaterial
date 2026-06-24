import { airportInputSchema } from "./airport.schema";

// POST /airports - the body carries the full airport to create.
export const createAirportDto = { body: airportInputSchema };
