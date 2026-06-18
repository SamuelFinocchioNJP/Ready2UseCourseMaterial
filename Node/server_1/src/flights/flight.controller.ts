import { Router, Request, Response } from "express";
import { FlightInput } from "../types";
import { RequestContext } from "../request-context";
import { handleError } from "../errors";
import { FlightUseCases } from "./use-cases";

// Builds the flights router with its use cases injected. Controllers own only
// HTTP concerns: parse the request into a use case input, call execute, and
// shape the response. Route identifiers go in `data`; ambient metadata in `context`.
export function createFlightsRouter(uc: FlightUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /flights            - list all flights
  // GET /flights?source=XXX - flights departing from airport XXX
  router.get("/", async (req: Request, res: Response) => {
    const source = req.query.source;
    const out =
      typeof source === "string"
        ? await uc.listFrom.execute({ context: ctx(req), data: { source } })
        : await uc.list.execute({ context: ctx(req), data: {} });
    return res.json(out.flights);
  });

  // GET /flights/:id - get one flight
  router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { flight } = await uc.get.execute({
        context: ctx(req),
        data: { id: Number(req.params.id) },
      });
      return res.json(flight);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /flights - create a flight (id is server-assigned; any client id is ignored)
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { flight } = await uc.create.execute({
        context: ctx(req),
        data: req.body as FlightInput,
      });
      return res.status(201).json(flight);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // PUT /flights/:id - update a flight
  router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { flight } = await uc.update.execute({
        context: ctx(req),
        data: { id: Number(req.params.id), flight: req.body as FlightInput },
      });
      return res.json(flight);
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /flights/:id - delete a flight
  router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      await uc.delete.execute({ context: ctx(req), data: { id: Number(req.params.id) } });
      return res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
