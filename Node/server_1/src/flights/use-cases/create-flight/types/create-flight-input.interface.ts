import { RequestContext } from "../../../../request-context";
import { FlightInput } from "../../../../types";

export interface CreateFlightInput {
  context: RequestContext;
  data: FlightInput;
}
