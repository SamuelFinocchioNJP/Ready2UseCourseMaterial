import { z } from "zod";

// Airport codes are plain strings in the domain (AirportCode = string); the HTTP
// edge only checks that a non-empty value was supplied.
export const airportCodeSchema = z.string().trim().min(1);

// HTTP-edge schema mirroring the domain AirportInput. z.infer<typeof
// airportInputSchema> is structurally assignable to AirportInput, so the
// controller can hand the parsed value straight to the use case.
export const airportInputSchema = z.object({
  code: airportCodeSchema,
  name: z.string().trim().min(1),
  city: z.string().trim().min(1),
  country: z.string().trim().min(1),
  timezone: z.string().trim().min(1),
});

export type AirportInputDto = z.infer<typeof airportInputSchema>;
