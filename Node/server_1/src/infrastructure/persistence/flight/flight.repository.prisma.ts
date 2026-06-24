import type { PrismaClient } from "../../../generated/prisma/client";
import { AirportCode } from "../../../domain/airport/airport";
import { Flight, FlightInput } from "../../../domain/flight/flight";
import { IFlightRepository } from "../../../application/flight/flight.repository";
import { flightMapper } from "./flight.mapper";

// Prisma-backed Flight repository. Pure persistence: speaks domain entities only
// (translation via flightMapper) and enforces no business rules — existence and
// referential-integrity checks live in the flight use cases.
export class PrismaFlightRepository implements IFlightRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async existsReferencing(code: AirportCode): Promise<boolean> {
    const referenced = await this.prisma.flight.findFirst({
      where: { OR: [{ source: code }, { destination: code }] },
    });
    return referenced !== null;
  }

  async findById(id: number): Promise<Flight | null> {
    const row = await this.prisma.flight.findUnique({ where: { id } });
    return row ? flightMapper.toDomain(row) : null;
  }

  async insertFlight(input: FlightInput): Promise<Flight> {
    const row = await this.prisma.flight.create({ data: flightMapper.toCreateData(input) });
    return flightMapper.toDomain(row);
  }

  async updateFlight(id: number, input: FlightInput): Promise<Flight> {
    const row = await this.prisma.flight.update({
      where: { id },
      data: flightMapper.toUpdateData(input),
    });
    return flightMapper.toDomain(row);
  }

  async deleteFlight(id: number): Promise<void> {
    await this.prisma.flight.delete({ where: { id } });
  }
}
