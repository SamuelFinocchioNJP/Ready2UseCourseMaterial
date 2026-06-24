import { z } from "zod";
import { airportCodeSchema } from "./airport.schema";

// DELETE /airports/:code - the path param identifies the airport to delete.
export const deleteAirportDto = { params: z.object({ code: airportCodeSchema }) };
