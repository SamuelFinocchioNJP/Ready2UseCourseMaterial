import { z } from "zod";
import { rerouteIdSchema } from "./flight-reroute.schema";

// DELETE /flight-reroutes/:id - the coerced numeric id identifies the reroute to delete.
export const deleteFlightRerouteDto = { params: z.object({ id: rerouteIdSchema }) };
