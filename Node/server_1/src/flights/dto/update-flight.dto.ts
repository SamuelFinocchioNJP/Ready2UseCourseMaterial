import { z } from "zod";
import { flightIdSchema, flightInputSchema } from "./flight.schema";

// PUT /flights/:id - the id comes from the path, the new flight from the body.
export const updateFlightDto = {
  params: z.object({ id: flightIdSchema }),
  body: flightInputSchema,
};
