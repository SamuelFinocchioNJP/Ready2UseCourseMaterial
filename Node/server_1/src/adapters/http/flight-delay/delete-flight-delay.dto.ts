import { z } from "zod";
import { delayIdSchema } from "./flight-delay.schema";

// DELETE /flight-delays/:id - the coerced numeric id identifies the delay to delete.
export const deleteFlightDelayDto = { params: z.object({ id: delayIdSchema }) };
