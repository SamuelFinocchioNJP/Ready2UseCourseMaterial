import { z } from "zod";
import { airportCodeSchema } from "../../airports/dto/airport.schema";

// Flight ids arrive as path-param strings; coerce to a positive integer so the
// use case receives a real number instead of a possible NaN.
export const flightIdSchema = z.coerce.number().int().positive();

// HTTP-edge schema mirroring the domain FlightInput (= Omit<Flight, "id">). It has
// no `id` key, so any client-sent id is dropped and ids stay server-assigned.
// Datetimes are validated as ISO 8601 strings (z.iso.datetime defaults to UTC `Z`).
export const flightInputSchema = z.object({
  source: airportCodeSchema,
  destination: airportCodeSchema,
  dateTimeDeparture: z.iso.datetime(),
  dateTimeLanding: z.iso.datetime(),
  airline: z.string().trim().min(1),
  flightNumber: z.string().trim().min(1),
});

export type FlightInputDto = z.infer<typeof flightInputSchema>;
