import { flightDelayInputSchema } from "./flight-delay.schema";

// POST /flight-delays - the body carries the delay to record (id/createdAt server-assigned).
export const createFlightDelayDto = { body: flightDelayInputSchema };
