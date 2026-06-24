import { z } from "zod";
import { airportCodeSchema } from "./airport.schema";

// GET /airports/:code - the path param identifies the airport.
export const getAirportDto = { params: z.object({ code: airportCodeSchema }) };
