import { z } from "zod";
import { rerouteIdSchema } from "./flight-reroute.schema";

// GET /flight-reroutes/:id - the coerced numeric id identifies the reroute.
export const getFlightRerouteDto = { params: z.object({ id: rerouteIdSchema }) };
