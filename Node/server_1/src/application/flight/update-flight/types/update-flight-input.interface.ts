import { RequestContext } from "../../../request-context";
import { FlightInput } from "../../../../domain/flight/flight";

export interface UpdateFlightInput {
  context: RequestContext;
  data: { id: number; flight: FlightInput };
}
