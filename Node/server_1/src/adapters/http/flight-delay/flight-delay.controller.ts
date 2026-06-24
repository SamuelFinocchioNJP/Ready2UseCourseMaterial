import { Router, Request, Response } from "express";
import { RequestContext } from "../../../application/request-context";
import { handleError } from "../http-error";
import { validate, validated } from "../validate";
import { FlightDelayUseCases } from "../../../application/flight-delay";
import { listFlightDelaysDto } from "./list-flight-delays.dto";
import { getFlightDelayDto } from "./get-flight-delay.dto";
import { createFlightDelayDto } from "./create-flight-delay.dto";
import { deleteFlightDelayDto } from "./delete-flight-delay.dto";
import { toFlightDelayResponse, toFlightDelayListResponse } from "./flight-delay-response.dto";

// Builds the flight-delays router with its use cases injected. Controllers own only
// HTTP concerns: validate the request, assemble the use-case input, shape the response.
export function createFlightDelaysRouter(uc: FlightDelayUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /flight-delays              - list all delays
  // GET /flight-delays?flightId=N   - a single flight's delay history
  router.get("/", validate(listFlightDelaysDto), async (req: Request, res: Response) => {
    try {
      const { query } = validated<typeof listFlightDelaysDto>(res);
      const out =
        query.flightId !== undefined
          ? await uc.listForFlight.execute({ context: ctx(req), data: { flightId: query.flightId } })
          : await uc.list.execute({ context: ctx(req), data: {} });
      return res.json(toFlightDelayListResponse(out.delays));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // GET /flight-delays/:id - get one delay
  router.get("/:id", validate(getFlightDelayDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof getFlightDelayDto>(res);
      const { delay } = await uc.get.execute({ context: ctx(req), data: { id: params.id } });
      return res.json(toFlightDelayResponse(delay));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /flight-delays - record a delay (id/createdAt server-assigned)
  router.post("/", validate(createFlightDelayDto), async (req: Request, res: Response) => {
    try {
      const { body } = validated<typeof createFlightDelayDto>(res);
      const { delay } = await uc.create.execute({ context: ctx(req), data: body });
      return res.status(201).json(toFlightDelayResponse(delay));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /flight-delays/:id - delete a delay
  router.delete("/:id", validate(deleteFlightDelayDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof deleteFlightDelayDto>(res);
      await uc.delete.execute({ context: ctx(req), data: { id: params.id } });
      return res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
