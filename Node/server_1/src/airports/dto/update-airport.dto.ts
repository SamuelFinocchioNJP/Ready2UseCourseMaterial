import { z } from "zod";
import type { AirportCode, AirportInput } from "../../types";
import { airportCodeSchema, airportInputSchema } from "./airport.schema";

// PUT /airports/:code - the code comes from the path, the fields from the body.
export const updateAirportDto = {
  params: z.object({ code: airportCodeSchema }),
  body: airportInputSchema,
};

// Airport code is identity: the path param wins over any code sent in the body.
// Produces exactly the UpdateAirportUseCase `data` shape.
export function toUpdateAirportData(
  params: z.infer<typeof updateAirportDto.params>,
  body: z.infer<typeof updateAirportDto.body>
): { code: AirportCode; airport: AirportInput } {
  return { code: params.code, airport: { ...body, code: params.code } };
}
