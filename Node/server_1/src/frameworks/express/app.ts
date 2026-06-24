import express, { Express } from "express";
import { AirportUseCases } from "../../application/airport";
import { FlightUseCases } from "../../application/flight";
import { FlightDelayUseCases } from "../../application/flight-delay";
import { FlightRerouteUseCases } from "../../application/flight-reroute";
import { createAirportsRouter } from "../../adapters/http/airport/airport.controller";
import { createFlightsRouter } from "../../adapters/http/flight/flight.controller";
import { createFlightDelaysRouter } from "../../adapters/http/flight-delay/flight-delay.controller";
import { createFlightReroutesRouter } from "../../adapters/http/flight-reroute/flight-reroute.controller";

// Assembles the Express application from the injected use-case bundles. Pure HTTP
// wiring: JSON body parsing plus the resource routers. The composition root builds
// the bundles; this module never touches persistence.
export function createApp(
  airportUseCases: AirportUseCases,
  flightUseCases: FlightUseCases,
  flightDelayUseCases: FlightDelayUseCases,
  flightRerouteUseCases: FlightRerouteUseCases
): Express {
  const app = express();
  app.use(express.json());
  app.use("/airports", createAirportsRouter(airportUseCases));
  app.use("/flights", createFlightsRouter(flightUseCases));
  app.use("/flight-delays", createFlightDelaysRouter(flightDelayUseCases));
  app.use("/flight-reroutes", createFlightReroutesRouter(flightRerouteUseCases));
  return app;
}
