import { Router, Request, Response } from "express";
import { RequestContext } from "../request-context";
import { handleError } from "../errors";
import { validate, validated } from "../http/validation";
import { AirportUseCases } from "./use-cases";
import { getAirportDto } from "./dto/get-airport.dto";
import { createAirportDto } from "./dto/create-airport.dto";
import { updateAirportDto, toUpdateAirportData } from "./dto/update-airport.dto";
import { deleteAirportDto } from "./dto/delete-airport.dto";
import { toAirportResponse, toAirportListResponse } from "./dto/airport-response.dto";

// Builds the airports router with its use cases injected. Controllers own only
// HTTP concerns: the per-endpoint DTO (validate) turns the request into a typed,
// validated input; the handler assembles the use case input, calls execute, and
// shapes the response through the response DTO. Route identifiers go in `data`;
// ambient metadata in `context`.
export function createAirportsRouter(uc: AirportUseCases): Router {
  const router = Router();

  const ctx = (_req: Request): RequestContext => ({});

  // GET /airports - list all airports (each with computed futureFlights).
  // No request input, so no input DTO.
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { airports } = await uc.list.execute({ context: ctx(req), data: {} });
      return res.json(toAirportListResponse(airports));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // GET /airports/:code - get one airport (with computed futureFlights)
  router.get("/:code", validate(getAirportDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof getAirportDto>(res);
      const { airport } = await uc.get.execute({
        context: ctx(req),
        data: { code: params.code },
      });
      return res.json(toAirportResponse(airport));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // POST /airports - create an airport
  router.post("/", validate(createAirportDto), async (req: Request, res: Response) => {
    try {
      const { body } = validated<typeof createAirportDto>(res);
      const { airport } = await uc.create.execute({ context: ctx(req), data: body });
      return res.status(201).json(toAirportResponse(airport));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // PUT /airports/:code - replace an airport's fields (code stays the path param)
  router.put("/:code", validate(updateAirportDto), async (req: Request, res: Response) => {
    try {
      const { params, body } = validated<typeof updateAirportDto>(res);
      const { airport } = await uc.update.execute({
        context: ctx(req),
        data: toUpdateAirportData(params, body),
      });
      return res.json(toAirportResponse(airport));
    } catch (err) {
      return handleError(err, res);
    }
  });

  // DELETE /airports/:code - delete an airport (blocked if any flight references it)
  router.delete("/:code", validate(deleteAirportDto), async (req: Request, res: Response) => {
    try {
      const { params } = validated<typeof deleteAirportDto>(res);
      const { airport } = await uc.delete.execute({
        context: ctx(req),
        data: { code: params.code },
      });
      return res.json(toAirportResponse(airport));
    } catch (err) {
      return handleError(err, res);
    }
  });

  return router;
}
