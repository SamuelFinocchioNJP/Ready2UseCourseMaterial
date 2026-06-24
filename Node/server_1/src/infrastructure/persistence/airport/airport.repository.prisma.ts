import type { PrismaClient } from "../../../generated/prisma/client";
import { Airport, AirportCode, AirportInput } from "../../../domain/airport/airport";
import { IAirportRepository } from "../../../application/airport/airport.repository";
import { airportMapper } from "./airport.mapper";

// Prisma-backed Airport repository. Pure persistence: speaks domain entities only
// (all schema<->domain translation goes through airportMapper) and enforces no
// business rules — uniqueness, existence and reference checks live in the use cases.
export class PrismaAirportRepository implements IAirportRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async listAirports(): Promise<Airport[]> {
    const rows = await this.prisma.airport.findMany();
    return rows.map(airportMapper.toDomain);
  }

  async findByCode(code: AirportCode): Promise<Airport | null> {
    const row = await this.prisma.airport.findUnique({ where: { id: code } });
    return row ? airportMapper.toDomain(row) : null;
  }

  async insertAirport(input: AirportInput): Promise<Airport> {
    const row = await this.prisma.airport.create({ data: airportMapper.toCreateData(input) });
    return airportMapper.toDomain(row);
  }

  async updateAirport(code: AirportCode, input: AirportInput): Promise<Airport> {
    const row = await this.prisma.airport.update({
      where: { id: code },
      data: airportMapper.toUpdateData(input), // code is the where key; never patched
    });
    return airportMapper.toDomain(row);
  }

  async deleteAirport(code: AirportCode): Promise<Airport> {
    const row = await this.prisma.airport.delete({ where: { id: code } });
    return airportMapper.toDomain(row);
  }
}
