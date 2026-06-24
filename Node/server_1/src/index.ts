import { compose } from "./frameworks/express/composition-root";
import { createApp } from "./frameworks/express/app";
import { importAirports } from "./infrastructure/airport-import.job";

// Process entry point. Builds the dependency graph (composition root), assembles
// the Express app, seeds airports from OpenFlights (non-fatal — a fetch/parse
// failure is logged and the server still boots), then starts listening on 8080.
const { airportUseCases, flightUseCases, flightDelayUseCases, flightRerouteUseCases } = compose();
const app = createApp(airportUseCases, flightUseCases, flightDelayUseCases, flightRerouteUseCases);

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
