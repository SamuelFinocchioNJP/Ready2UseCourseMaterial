import { z } from "zod";
import { flightIdSchema } from "../flight/flight.schema";
import { airportCodeSchema } from "../airport/airport.schema";

// FlightReroute ids arrive as path-param strings; coerce to a positive integer.
export const rerouteIdSchema = z.coerce.number().int().positive();

// HTTP-edge schema mirroring the domain FlightRerouteInput (no id / createdAt — both
// server-assigned).
export const flightRerouteInputSchema = z.object({
  flightId: flightIdSchema,
  newDestination: airportCodeSchema,
  reason: z.string().trim().min(1),
});

export type FlightRerouteInputDto = z.infer<typeof flightRerouteInputSchema>;
