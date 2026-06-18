import express from "express";
import { prisma } from "./prisma";
import { PrismaAirportRepository } from "./airports/repository/airport.repository.prisma";
import { PrismaFlightRepository } from "./flights/repository/flight.repository.prisma";
import { createAirportUseCases } from "./airports/use-cases";
import { createFlightUseCases } from "./flights/use-cases";
import { createAirportsRouter } from "./airports/airport.controller";
import { createFlightsRouter } from "./flights/flight.controller";
import { importAirports } from "./airports/airport-import.job";

// Compose the dependency graph: the Prisma repositories (sharing one PrismaClient)
// back the aggregates and are injected into the use case bundles, which are injected
// into their routers. The InMemoryRepository in ./database remains as the test double.
const airportRepo = new PrismaAirportRepository(prisma);
const flightRepo = new PrismaFlightRepository(prisma);
const airportUseCases = createAirportUseCases(airportRepo, flightRepo);
const flightUseCases = createFlightUseCases(flightRepo);

const app = express();

app.use(express.json());

app.use("/airports", createAirportsRouter(airportUseCases));
app.use("/flights", createFlightsRouter(flightUseCases));

// Seed the in-memory store from OpenFlights before serving. A fetch/parse
// failure is logged but non-fatal: the server still boots with an empty store.
async function start() {
  try {
    const summary = await importAirports(airportUseCases);
    console.log("Airports seeded:", summary);
  } catch (err) {
    console.error("Airport import failed; starting with empty store:", err);
  }

  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}

start();
