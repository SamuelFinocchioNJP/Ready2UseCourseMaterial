import { Router, Request, Response } from "express";
import { RequestContext } from "../../../application/request-context";
import { handleError } from "../http-error";
import { validate, validated } from "../validate";
import { FlightRerouteUseCases } from "../../../application/flight-reroute";
import { listFlightReroutesDto } from "./list-flight-reroutes.dto";
import { getFlightRerouteDto } from "./get-flight-reroute.dto";
import { createFlightRerouteDto } from "./create-flight-reroute.dto";
import { deleteFlightRerouteDto } from "./delete-flight-reroute.dto";
import { toFlightRerouteResponse, toFlightRerouteListResponse } from "./flight-reroute-response.dto";

// Builds the flight-reroutes router with its use cases injected. Controllers own only
// HTTP concerns: validate the request, assemble the use-case input, shape the response.
export function createFlightReroutesRouter(uc: FlightRerouteUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /flight-reroutes              - list all reroutes
  // GET /flight-reroutes?flightId=N   - a single flight's reroute history
  router.get("/", validate(listFlightReroutesDto), async (req: Request, res: Response) => {
    try {
      const { query } = validated<typeof listFlightReroutesDto>(res);
      const out =
        query.flightId !== undefined
          ? await uc.listForFlight.execute({ context: ctx(req), data: { flightId: query.flightId } })
          : await uc.list.execute({ context: ctx(req), data: {} });
      return res.json(toFlightRerouteListResponse(out.reroutes));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // GET /flight-reroutes/:id - get one reroute
  router.get("/:id", validate(getFlightRerouteDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof getFlightRerouteDto>(res);
      const { reroute } = await uc.get.execute({ context: ctx(req), data: { id: params.id } });
      return res.json(toFlightRerouteResponse(reroute));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /flight-reroutes - record a reroute (id/createdAt server-assigned)
  router.post("/", validate(createFlightRerouteDto), async (req: Request, res: Response) => {
    try {
      const { body } = validated<typeof createFlightRerouteDto>(res);
      const { reroute } = await uc.create.execute({ context: ctx(req), data: body });
      return res.status(201).json(toFlightRerouteResponse(reroute));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /flight-reroutes/:id - delete a reroute
  router.delete("/:id", validate(deleteFlightRerouteDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof deleteFlightRerouteDto>(res);
      await uc.delete.execute({ context: ctx(req), data: { id: params.id } });
      return res.status(204).end();
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
