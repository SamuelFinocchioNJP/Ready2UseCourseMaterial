import { z } from "zod";
import { flightIdSchema } from "../flight/flight.schema";

// GET /flight-delays and GET /flight-delays?flightId=N - an optional `flightId`
// filters to that flight's delay history. A repeated ?flightId=a&flightId=b
// (which Express parses into an array) fails validation and yields a 400.
export const listFlightDelaysDto = {
  query: z.object({ flightId: flightIdSchema.optional() }),
};
