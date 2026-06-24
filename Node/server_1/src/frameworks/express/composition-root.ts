import { prisma } from "../../infrastructure/persistence/prisma";
import { PrismaAirportRepository } from "../../infrastructure/persistence/airport/airport.repository.prisma";
import { PrismaFlightRepository } from "../../infrastructure/persistence/flight/flight.repository.prisma";
import { PrismaFlightDelayRepository } from "../../infrastructure/persistence/flight-delay/flight-delay.repository.prisma";
import { PrismaFlightRerouteRepository } from "../../infrastructure/persistence/flight-reroute/flight-reroute.repository.prisma";
import { createAirportUseCases, AirportUseCases } from "../../application/airport";
import { createFlightUseCases, FlightUseCases } from "../../application/flight";
import { createFlightDelayUseCases, FlightDelayUseCases } from "../../application/flight-delay";
import { createFlightRerouteUseCases, FlightRerouteUseCases } from "../../application/flight-reroute";

export interface AppDependencies {
  airportUseCases: AirportUseCases;
  flightUseCases: FlightUseCases;
  flightDelayUseCases: FlightDelayUseCases;
  flightRerouteUseCases: FlightRerouteUseCases;
}

// The single place that news up the Prisma repositories (sharing one PrismaClient)
// and injects them into the use-case bundles. Wiring is explicit; no IoC container.
// Airport delete depends on the reroute repo (to block deleting a referenced airport);
// delay/reroute creates depend on the flight (and airport) repos for integrity checks.
export function compose(): AppDependencies {
  const airportRepo = new PrismaAirportRepository(prisma);
  const flightRepo = new PrismaFlightRepository(prisma);
  const flightDelayRepo = new PrismaFlightDelayRepository(prisma);
  const flightRerouteRepo = new PrismaFlightRerouteRepository(prisma);

  const airportUseCases = createAirportUseCases(airportRepo, flightRepo, flightRerouteRepo);
  const flightUseCases = createFlightUseCases(flightRepo, airportRepo);
  const flightDelayUseCases = createFlightDelayUseCases(flightDelayRepo, flightRepo);
  const flightRerouteUseCases = createFlightRerouteUseCases(flightRerouteRepo, flightRepo, airportRepo);

  return { airportUseCases, flightUseCases, flightDelayUseCases, flightRerouteUseCases };
}
