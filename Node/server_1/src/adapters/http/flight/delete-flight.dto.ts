import { z } from "zod";
import { flightIdSchema } from "./flight.schema";

// DELETE /flights/:id - the coerced numeric id identifies the flight to delete.
export const deleteFlightDto = { params: z.object({ id: flightIdSchema }) };
