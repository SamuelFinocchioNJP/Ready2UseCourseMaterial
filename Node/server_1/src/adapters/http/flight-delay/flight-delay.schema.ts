import { z } from "zod";
import { flightIdSchema } from "../flight/flight.schema";

// FlightDelay ids arrive as path-param strings; coerce to a positive integer.
export const delayIdSchema = z.coerce.number().int().positive();

// HTTP-edge schema mirroring the domain FlightDelayInput (no id / createdAt — both
// server-assigned). Datetimes are validated as ISO 8601 strings (UTC `Z`).
export const flightDelayInputSchema = z.object({
  flightId: flightIdSchema,
  dateTimeDeparture: z.iso.datetime(),
  dateTimeLanding: z.iso.datetime(),
  reason: z.string().trim().min(1),
});

export type FlightDelayInputDto = z.infer<typeof flightDelayInputSchema>;
