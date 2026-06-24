import { RequestContext } from "../../../request-context";
import { FlightDelayInput } from "../../../../domain/flight-delay/flight-delay";

export interface CreateFlightDelayInput {
  context: RequestContext;
  data: FlightDelayInput;
}
