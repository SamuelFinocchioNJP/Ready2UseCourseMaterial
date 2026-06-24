import { prisma } from "../../infrastructure/persistence/prisma";
import { PrismaAirportRepository } from "../../infrastructure/persistence/airport/airport.repository.prisma";
import { PrismaFlightRepository } from "../../infrastructure/persistence/flight/flight.repository.prisma";
import { createAirportUseCases, AirportUseCases } from "../../application/airport";
import { createFlightUseCases, FlightUseCases } from "../../application/flight";

export interface AppDependencies {
  airportUseCases: AirportUseCases;
  flightUseCases: FlightUseCases;
}

// The single place that news up the Prisma repositories (sharing one PrismaClient)
// and injects them into the use-case bundles. Wiring is explicit; no IoC container.
export function compose(): AppDependencies {
  const airportRepo = new PrismaAirportRepository(prisma);
  const flightRepo = new PrismaFlightRepository(prisma);
  const airportUseCases = createAirportUseCases(airportRepo, flightRepo);
  const flightUseCases = createFlightUseCases(flightRepo, airportRepo);
  return { airportUseCases, flightUseCases };
}
