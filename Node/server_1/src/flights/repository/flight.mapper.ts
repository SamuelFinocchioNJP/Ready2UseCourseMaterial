import type { FlightModel } from "../../generated/prisma/models";
import type { Prisma } from "../../generated/prisma/client";
import { Flight, FlightInput } from "../../types";

// The only place the Flight domain<->schema mismatch lives:
//   schema `DateTime` (JS Date)  <->  domain ISO `string`. Converted in both directions.
// Scalar FKs (source/destination) are written via the unchecked input variant.
export const flightMapper = {
  toDomain(row: FlightModel): Flight {
    return {
      id: row.id,
      source: row.source,
      destination: row.destination,
      dateTimeDeparture: row.dateTimeDeparture.toISOString(),
      dateTimeLanding: row.dateTimeLanding.toISOString(),
      airline: row.airline,
      flightNumber: row.flightNumber,
    };
  },

  toCreateData(input: FlightInput): Prisma.FlightUncheckedCreateInput {
    return {
      source: input.source,
      destination: input.destination,
      dateTimeDeparture: new Date(input.dateTimeDeparture),
      dateTimeLanding: new Date(input.dateTimeLanding),
      airline: input.airline,
      flightNumber: input.flightNumber,
    };
  },

  toUpdateData(input: FlightInput): Prisma.FlightUncheckedUpdateInput {
    return {
      source: input.source,
      destination: input.destination,
      dateTimeDeparture: new Date(input.dateTimeDeparture),
      dateTimeLanding: new Date(input.dateTimeLanding),
      airline: input.airline,
      flightNumber: input.flightNumber,
    };
  },
};
