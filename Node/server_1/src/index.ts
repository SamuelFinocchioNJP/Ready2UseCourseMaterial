import express from "express";
import airportsRouter from "./airports/airport.controller";
import flightsRouter from "./flights/flight.controller";
import { importAirports } from "./airports/airport-import.job";

const app = express();

app.use(express.json());

app.use("/airports", airportsRouter);
app.use("/flights", flightsRouter);

// Seed the in-memory store from OpenFlights before serving. A fetch/parse
// failure is logged but non-fatal: the server still boots with an empty store.
async function start() {
  try {
    const summary = await importAirports();
    console.log("Airports seeded:", summary);
  } catch (err) {
    console.error("Airport import failed; starting with empty store:", err);
  }

  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}

start();
