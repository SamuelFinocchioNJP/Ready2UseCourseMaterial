import type { PrismaClient } from "../../generated/prisma/client";
import { Airport, AirportCode, AirportInput } from "../../types";
import { ConflictError, NotFoundError } from "../../errors";
import { IAirportRepository } from "./airport.repository.interface";
import { airportMapper } from "./airport.mapper";

// Prisma-backed Airport repository. Speaks domain entities only; all
// schema<->domain translation goes through airportMapper. Holds the shared
// PrismaClient singleton, which also lets it enforce the cross-aggregate
// "cannot delete a referenced airport" rule against the Flight table.
export class PrismaAirportRepository implements IAirportRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async listAirports(): Promise<Airport[]> {
    const rows = await this.prisma.airport.findMany();
    return rows.map(airportMapper.toDomain);
  }

  async getAirport(id: AirportCode): Promise<Airport> {
    const row = await this.prisma.airport.findUnique({ where: { id } });
    if (!row) throw new NotFoundError(`Airport "${id}" not found`);
    return airportMapper.toDomain(row);
  }

  async createAirport(input: AirportInput): Promise<Airport> {
    const existing = await this.prisma.airport.findUnique({ where: { id: input.code } });
    if (existing) throw new ConflictError(`Airport "${input.code}" already exists`);
    const row = await this.prisma.airport.create({ data: airportMapper.toCreateData(input) });
    return airportMapper.toDomain(row);
  }

  async updateAirport(id: AirportCode, input: AirportInput): Promise<Airport> {
    const existing = await this.prisma.airport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(`Airport "${id}" not found`);
    const row = await this.prisma.airport.update({
      where: { id },
      data: airportMapper.toUpdateData(input), // code is the where key; never patched
    });
    return airportMapper.toDomain(row);
  }

  async deleteAirport(id: AirportCode): Promise<Airport> {
    const existing = await this.prisma.airport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(`Airport "${id}" not found`);

    const referenced = await this.prisma.flight.findFirst({
      where: { OR: [{ source: id }, { destination: id }] },
    });
    if (referenced) {
      throw new ConflictError(`Airport "${id}" cannot be deleted while flights reference it`);
    }

    await this.prisma.airport.delete({ where: { id } });
    return airportMapper.toDomain(existing);
  }
}
