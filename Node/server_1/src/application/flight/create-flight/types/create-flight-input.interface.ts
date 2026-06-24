import { RequestContext } from "../../../request-context";
import { FlightInput } from "../../../../domain/flight/flight";

export interface CreateFlightInput {
  context: RequestContext;
  data: FlightInput;
}
