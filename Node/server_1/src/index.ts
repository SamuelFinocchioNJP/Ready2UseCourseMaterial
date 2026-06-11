import express from "express";
import airportsRouter from "./controllers/airport.controller";
import flightsRouter from "./controllers/flight.controller";

const app = express();

app.use(express.json());

app.use("/airports", airportsRouter);
app.use("/flights", flightsRouter);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
