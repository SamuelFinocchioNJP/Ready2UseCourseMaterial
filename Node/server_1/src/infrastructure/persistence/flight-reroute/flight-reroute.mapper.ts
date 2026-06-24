import type { FlightRerouteModel } from "../../../generated/prisma/models";
import type { Prisma } from "../../../generated/prisma/client";
import { FlightReroute, FlightRerouteInput } from "../../../domain/flight-reroute/flight-reroute";

// The only place the FlightReroute domain<->schema mismatch lives:
//   schema `DateTime` createdAt  <->  domain ISO `string`. The flightId and
//   newDestination scalar FKs are written via the unchecked input variant.
//   createdAt is DB-defaulted (@default(now())), so it is never set on create.
export const flightRerouteMapper = {
  toDomain(row: FlightRerouteModel): FlightReroute {
    return {
      id: row.id,
      flightId: row.flightId,
      newDestination: row.newDestination,
      reason: row.reason,
      createdAt: row.createdAt.toISOString(),
    };
  },

  toCreateData(input: FlightRerouteInput): Prisma.FlightRerouteUncheckedCreateInput {
    return {
      flightId: input.flightId,
      newDestination: input.newDestination,
      reason: input.reason,
    };
  },
};
