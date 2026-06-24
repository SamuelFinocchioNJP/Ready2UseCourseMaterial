import { flightRerouteInputSchema } from "./flight-reroute.schema";

// POST /flight-reroutes - the body carries the reroute to record (id/createdAt server-assigned).
export const createFlightRerouteDto = { body: flightRerouteInputSchema };
