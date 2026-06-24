import express, { Express } from "express";
import { AirportUseCases } from "../../application/airport";
import { FlightUseCases } from "../../application/flight";
import { createAirportsRouter } from "../../adapters/http/airport/airport.controller";
import { createFlightsRouter } from "../../adapters/http/flight/flight.controller";

// Assembles the Express application from the injected use-case bundles. Pure HTTP
// wiring: JSON body parsing plus the two resource routers. The composition root
// builds the bundles; this module never touches persistence.
export function createApp(
  airportUseCases: AirportUseCases,
  flightUseCases: FlightUseCases
): Express {
  const app = express();
  app.use(express.json());
  app.use("/airports", createAirportsRouter(airportUseCases));
  app.use("/flights", createFlightsRouter(flightUseCases));
  return app;
}
