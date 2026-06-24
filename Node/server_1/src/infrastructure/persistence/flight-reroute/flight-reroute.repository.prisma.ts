import type { PrismaClient } from "../../../generated/prisma/client";
import { AirportCode } from "../../../domain/airport/airport";
import { FlightReroute, FlightRerouteInput } from "../../../domain/flight-reroute/flight-reroute";
import { IFlightRerouteRepository } from "../../../application/flight-reroute/flight-reroute.repository";
import { flightRerouteMapper } from "./flight-reroute.mapper";

// Prisma-backed FlightReroute repository. Pure persistence: speaks domain entities
// only (translation via flightRerouteMapper) and enforces no business rules — the
// flight's and destination airport's existence are checked in the reroute use cases.
export class PrismaFlightRerouteRepository implements IFlightRerouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listReroutes(): Promise<FlightReroute[]> {
    const rows = await this.prisma.flightReroute.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(flightRerouteMapper.toDomain);
  }

  async reroutesForFlight(flightId: number): Promise<FlightReroute[]> {
    const rows = await this.prisma.flightReroute.findMany({
      where: { flightId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(flightRerouteMapper.toDomain);
  }

  async findById(id: number): Promise<FlightReroute | null> {
    const row = await this.prisma.flightReroute.findUnique({ where: { id } });
    return row ? flightRerouteMapper.toDomain(row) : null;
  }

  async insertReroute(input: FlightRerouteInput): Promise<FlightReroute> {
    const row = await this.prisma.flightReroute.create({
      data: flightRerouteMapper.toCreateData(input),
    });
    return flightRerouteMapper.toDomain(row);
  }

  async deleteReroute(id: number): Promise<void> {
    await this.prisma.flightReroute.delete({ where: { id } });
  }

  async existsReferencingDestination(code: AirportCode): Promise<boolean> {
    const referenced = await this.prisma.flightReroute.findFirst({
      where: { newDestination: code },
    });
    return referenced !== null;
  }
}
