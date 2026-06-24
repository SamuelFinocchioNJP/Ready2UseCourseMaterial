import { z } from "zod";
import { airportCodeSchema } from "../airport/airport.schema";

// GET /flights and GET /flights?source=XXX - an optional `source` airport filters
// to departures from that airport. A repeated ?source=a&source=b (which Express
// parses into an array) fails validation and yields a 400.
export const listFlightsDto = {
  query: z.object({ source: airportCodeSchema.optional() }),
};
