import { Router, Request, Response } from "express";
import { FlightInput } from "../types";
import * as flightService from "../services/flight.service";
import { handleError } from "../errors";

const router = Router();

// GET /flights - list all flights
router.get("/", (req: Request, res: Response) => {
  return res.json(flightService.listFlights());
});

// GET /flights/:id - get one flight
router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  try {
    return res.json(flightService.getFlight(Number(req.params.id)));
  } catch (err) {
    return handleError(err, res);
  }
});

// POST /flights - create a flight (id is server-assigned; any client id is ignored)
router.post("/", (req: Request, res: Response) => {
  try {
    const flight = flightService.createFlight(req.body as FlightInput);
    return res.status(201).json(flight);
  } catch (err) {
    return handleError(err, res);
  }
});

// PUT /flights/:id - update a flight
router.put("/:id", (req: Request<{ id: string }>, res: Response) => {
  try {
    const flight = flightService.updateFlight(Number(req.params.id), req.body as FlightInput);
    return res.json(flight);
  } catch (err) {
    return handleError(err, res);
  }
});

// DELETE /flights/:id - delete a flight
router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  try {
    flightService.deleteFlight(Number(req.params.id));
    return res.status(204).end();
  } catch (err) {
    return handleError(err, res);
  }
});

export default router;
