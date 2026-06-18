import { Router, Request, Response } from "express";
import { AirportInput } from "../types";
import { RequestContext } from "../request-context";
import { handleError } from "../errors";
import { AirportUseCases } from "./use-cases";

// Builds the airports router with its use cases injected. Controllers own only
// HTTP concerns: parse the request into a use case input, call execute, and
// shape the response. Route identifiers go in `data`; ambient metadata in `context`.
export function createAirportsRouter(uc: AirportUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /airports - list all airports (each with computed futureFlights)
  router.get("/", async (req: Request, res: Response) => {
    const { airports } = await uc.list.execute({ context: ctx(req), data: {} });
    return res.json(airports);
  });

  // GET /airports/:code - get one airport (with computed futureFlights)
  router.get("/:code", async (req: Request<{ code: string }>, res: Response) => {
    try {
      const { airport } = await uc.get.execute({
        context: ctx(req),
        data: { code: req.params.code },
      });
      return res.json(airport);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /airports - create an airport
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { airport } = await uc.create.execute({
        context: ctx(req),
        data: req.body as AirportInput,
      });
      return res.status(201).json(airport);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // PUT /airports/:code - replace an airport's fields (code stays the path param)
  router.put("/:code", async (req: Request<{ code: string }>, res: Response) => {
    try {
      const { airport } = await uc.update.execute({
        context: ctx(req),
        data: { code: req.params.code, airport: req.body as AirportInput },
      });
      return res.json(airport);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /airports/:code - delete an airport (blocked if any flight references it)
  router.delete("/:code", async (req: Request<{ code: string }>, res: Response) => {
    try {
      const { airport } = await uc.delete.execute({
        context: ctx(req),
        data: { code: req.params.code },
      });
      return res.json(airport);
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
