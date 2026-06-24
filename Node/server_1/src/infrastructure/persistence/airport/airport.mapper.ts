import type { AirportModel } from "../../../generated/prisma/models";
import type { Prisma } from "../../../generated/prisma/client";
import { Airport, AirportInput } from "../../../domain/airport/airport";

// The only place the Airport domain<->schema mismatch lives:
//   schema primary key `id`  <->  domain `code`.
// `futureFlights` is a computed view (not persisted), so it is never mapped here.
export const airportMapper = {
  toDomain(row: AirportModel): Airport {
    return {
      code: row.id,
      name: row.name,
      city: row.city,
      country: row.country,
      timezone: row.timezone,
    };
  },

  toCreateData(input: AirportInput): Prisma.AirportCreateInput {
    return {
      id: input.code,
      name: input.name,
      city: input.city,
      country: input.country,
      timezone: input.timezone,
    };
  },

  // `code` is the identity (the `where` key on update), so it is not part of the patch.
  toUpdateData(input: AirportInput): Prisma.AirportUpdateInput {
    return {
      name: input.name,
      city: input.city,
      country: input.country,
      timezone: input.timezone,
    };
  },
};
