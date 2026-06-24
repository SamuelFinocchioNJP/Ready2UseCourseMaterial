import { z } from "zod";
import { delayIdSchema } from "./flight-delay.schema";

// GET /flight-delays/:id - the coerced numeric id identifies the delay.
export const getFlightDelayDto = { params: z.object({ id: delayIdSchema }) };
