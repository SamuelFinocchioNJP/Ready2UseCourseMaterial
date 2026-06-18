import express from "express";
import { Database } from "./database";
import { createAirportUseCases } from "./airports/use-cases";
import { createFlightUseCases } from "./flights/use-cases";
import { createAirportsRouter } from "./airports/airport.controller";
import { createFlightsRouter } from "./flights/flight.controller";
import { importAirports } from "./airports/airport-import.job";

// Compose the dependency graph: one Database instance is injected into every
// use case, and the use case bundles are injected into their routers.
const db = new Database();
const airportUseCases = createAirportUseCases(db);
const flightUseCases = createFlightUseCases(db);

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
