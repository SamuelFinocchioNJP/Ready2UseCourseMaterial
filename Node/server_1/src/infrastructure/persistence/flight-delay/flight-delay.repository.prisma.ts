import type { PrismaClient } from "../../../generated/prisma/client";
import { FlightDelay, FlightDelayInput } from "../../../domain/flight-delay/flight-delay";
import { IFlightDelayRepository } from "../../../application/flight-delay/flight-delay.repository";
import { flightDelayMapper } from "./flight-delay.mapper";

// Prisma-backed FlightDelay repository. Pure persistence: speaks domain entities
// only (translation via flightDelayMapper) and enforces no business rules — the
// referenced flight's existence is checked in the flight-delay use cases.
export class PrismaFlightDelayRepository implements IFlightDelayRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listDelays(): Promise<FlightDelay[]> {
    const rows = await this.prisma.flightDelay.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(flightDelayMapper.toDomain);
  }

  async delaysForFlight(flightId: number): Promise<FlightDelay[]> {
    const rows = await this.prisma.flightDelay.findMany({
      where: { flightId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(flightDelayMapper.toDomain);
  }

  async findById(id: number): Promise<FlightDelay | null> {
    const row = await this.prisma.flightDelay.findUnique({ where: { id } });
    return row ? flightDelayMapper.toDomain(row) : null;
  }

  async insertDelay(input: FlightDelayInput): Promise<FlightDelay> {
    const row = await this.prisma.flightDelay.create({
      data: flightDelayMapper.toCreateData(input),
    });
    return flightDelayMapper.toDomain(row);
  }

  async deleteDelay(id: number): Promise<void> {
    await this.prisma.flightDelay.delete({ where: { id } });
  }
}
