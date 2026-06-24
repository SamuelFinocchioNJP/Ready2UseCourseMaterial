import { z } from "zod";
import { flightIdSchema } from "../flight/flight.schema";

// GET /flight-reroutes and GET /flight-reroutes?flightId=N - an optional `flightId`
// filters to that flight's reroute history. A repeated ?flightId=a&flightId=b
// (which Express parses into an array) fails validation and yields a 400.
export const listFlightReroutesDto = {
  query: z.object({ flightId: flightIdSchema.optional() }),
};
