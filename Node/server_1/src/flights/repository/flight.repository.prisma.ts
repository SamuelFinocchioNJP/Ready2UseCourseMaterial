import type { PrismaClient } from "../../generated/prisma/client";
import { AirportCode, Flight, FlightInput } from "../../types";
import { IntegrityError, NotFoundError } from "../../errors";
import { IFlightRepository } from "./flight.repository.interface";
import { flightMapper } from "./flight.mapper";

// Prisma-backed Flight repository. Speaks domain entities only; all
// schema<->domain translation goes through flightMapper. Holds the shared
// PrismaClient singleton, which also lets it enforce the cross-aggregate
// "both endpoint airports must exist" rule against the Airport table.
export class PrismaFlightRepository implements IFlightRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Referential integrity: both endpoints of a flight must reference existing airports.
  private async assertAirportsExist(source: AirportCode, destination: AirportCode): Promise<void> {
    const src = await this.prisma.airport.findUnique({ where: { id: source } });
    if (!src) throw new IntegrityError(`Unknown airport "${source}"`);
    const dst = await this.prisma.airport.findUnique({ where: { id: destination } });
    if (!dst) throw new IntegrityError(`Unknown airport "${destination}"`);
  }

  async listFlights(): Promise<Flight[]> {
    const rows = await this.prisma.flight.findMany();
    return rows.map(flightMapper.toDomain);
  }

  async flightsFrom(source: AirportCode): Promise<Flight[]> {
    const rows = await this.prisma.flight.findMany({ where: { source } });
    return rows.map(flightMapper.toDomain);
  }

  async listUpcomingByAirport(code: AirportCode): Promise<Flight[]> {
    const rows = await this.prisma.flight.findMany({
      where: { source: code, dateTimeDeparture: { gt: new Date() } },
    });
    return rows.map(flightMapper.toDomain);
  }

  async getFlight(id: number): Promise<Flight> {
    const row = await this.prisma.flight.findUnique({ where: { id } });
    if (!row) throw new NotFoundError(`Flight ${id} not found`);
    return flightMapper.toDomain(row);
  }

  async createFlight(input: FlightInput): Promise<Flight> {
    await this.assertAirportsExist(input.source, input.destination);
    const row = await this.prisma.flight.create({ data: flightMapper.toCreateData(input) });
    return flightMapper.toDomain(row);
  }

  async updateFlight(id: number, input: FlightInput): Promise<Flight> {
    const existing = await this.prisma.flight.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(`Flight ${id} not found`);
    await this.assertAirportsExist(input.source, input.destination);
    const row = await this.prisma.flight.update({
      where: { id },
      data: flightMapper.toUpdateData(input),
    });
    return flightMapper.toDomain(row);
  }

  async deleteFlight(id: number): Promise<void> {
    const existing = await this.prisma.flight.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError(`Flight ${id} not found`);
    await this.prisma.flight.delete({ where: { id } });
  }
}
