import { z } from "zod";
import { flightIdSchema } from "./flight.schema";

// GET /flights/:id - the coerced numeric id identifies the flight.
export const getFlightDto = { params: z.object({ id: flightIdSchema }) };
