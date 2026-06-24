import { Router, Request, Response } from "express";
import { RequestContext } from "../../../application/request-context";
import { handleError } from "../http-error";
import { validate, validated } from "../validate";
import { FlightUseCases } from "../../../application/flight";
import { listFlightsDto } from "./list-flights.dto";
import { getFlightDto } from "./get-flight.dto";
import { createFlightDto } from "./create-flight.dto";
import { updateFlightDto } from "./update-flight.dto";
import { deleteFlightDto } from "./delete-flight.dto";
import { toFlightResponse, toFlightListResponse } from "./flight-response.dto";

// Builds the flights router with its use cases injected. Controllers own only
// HTTP concerns: the per-endpoint DTO (validate) turns the request into a typed,
// validated input; the handler assembles the use case input, calls execute, and
// shapes the response through the response DTO. Route identifiers go in `data`;
// ambient metadata in `context`.
export function createFlightsRouter(uc: FlightUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /flights            - list all flights
  // GET /flights?source=XXX - flights departing from airport XXX
  router.get("/", validate(listFlightsDto), async (req: Request, res: Response) => {
    try {
      const { query } = validated<typeof listFlightsDto>(res);
      const out = query.source
        ? await uc.listFrom.execute({ context: ctx(req), data: { source: query.source } })
        : await uc.list.execute({ context: ctx(req), data: {} });
      return res.json(toFlightListResponse(out.flights));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // GET /flights/:id - get one flight
  router.get("/:id", validate(getFlightDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof getFlightDto>(res);
      const { flight } = await uc.get.execute({
        context: ctx(req),
        data: { id: params.id },
      });
      return res.json(toFlightResponse(flight));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /flights - create a flight (id is server-assigned; any client id is ignored)
  router.post("/", validate(createFlightDto), async (req: Request, res: Response) => {
    try {
      const { body } = validated<typeof createFlightDto>(res);
      const { flight } = await uc.create.execute({ context: ctx(req), data: body });
      return res.status(201).json(toFlightResponse(flight));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // PUT /flights/:id - update a flight
  router.put("/:id", validate(updateFlightDto), async (req: Request, res: Response) => {
    try {
      const { params, body } = validated<typeof updateFlightDto>(res);
      const { flight } = await uc.update.execute({
        context: ctx(req),
        data: { id: params.id, flight: body },
      });
      return res.json(toFlightResponse(flight));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /flights/:id - delete a flight
  router.delete("/:id", validate(deleteFlightDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof deleteFlightDto>(res);
      await uc.delete.execute({ context: ctx(req), data: { id: params.id } });
      return res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
