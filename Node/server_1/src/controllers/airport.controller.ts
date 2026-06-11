import { Router, Request, Response } from "express";
import { AirportInput } from "../types";
import * as airportService from "../services/airport.service";
import { handleError } from "../errors";

const router = Router();

// GET /airports - list all airports (each with computed futureFlights)
router.get("/", (req: Request, res: Response) => {
  return res.json(airportService.listAirports());
});

// GET /airports/:code - get one airport (with computed futureFlights)
router.get("/:code", (req: Request<{ code: string }>, res: Response) => {
  try {
    return res.json(airportService.getAirport(req.params.code));
  } catch (err) {
    return handleError(err, res);
  }
});

// POST /airports - create an airport
router.post("/", (req: Request, res: Response) => {
  try {
    const airport = airportService.createAirport(req.body as AirportInput);
    return res.status(201).json(airport);
  } catch (err) {
    return handleError(err, res);
  }
});

// PUT /airports/:code - replace an airport's fields (code stays the path param)
router.put("/:code", (req: Request<{ code: string }>, res: Response) => {
  try {
    const airport = airportService.updateAirport(req.params.code, req.body as AirportInput);
    return res.json(airport);
  } catch (err) {
    return handleError(err, res);
  }
});

// DELETE /airports/:code - delete an airport (blocked if any flight references it)
router.delete("/:code", (req: Request<{ code: string }>, res: Response) => {
  try {
    return res.json(airportService.deleteAirport(req.params.code));
  } catch (err) {
    return handleError(err, res);
  }
});

export default router;
