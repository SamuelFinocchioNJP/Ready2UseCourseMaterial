import type { FlightDelayModel } from "../../../generated/prisma/models";
import type { Prisma } from "../../../generated/prisma/client";
import { FlightDelay, FlightDelayInput } from "../../../domain/flight-delay/flight-delay";

// The only place the FlightDelay domain<->schema mismatch lives:
//   schema `DateTime` (JS Date)  <->  domain ISO `string`. Converted in both directions.
// The flightId scalar FK is written via the unchecked input variant. createdAt is
// DB-defaulted (@default(now())), so it is never set on create.
export const flightDelayMapper = {
  toDomain(row: FlightDelayModel): FlightDelay {
    return {
      id: row.id,
      flightId: row.flightId,
      dateTimeDeparture: row.dateTimeDeparture.toISOString(),
      dateTimeLanding: row.dateTimeLanding.toISOString(),
      reason: row.reason,
      createdAt: row.createdAt.toISOString(),
    };
  },

  toCreateData(input: FlightDelayInput): Prisma.FlightDelayUncheckedCreateInput {
    return {
      flightId: input.flightId,
      dateTimeDeparture: new Date(input.dateTimeDeparture),
      dateTimeLanding: new Date(input.dateTimeLanding),
      reason: input.reason,
    };
  },
};
