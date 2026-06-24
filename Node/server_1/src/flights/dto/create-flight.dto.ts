import { flightInputSchema } from "./flight.schema";

// POST /flights - the body carries the flight to create (id is server-assigned).
export const createFlightDto = { body: flightInputSchema };
