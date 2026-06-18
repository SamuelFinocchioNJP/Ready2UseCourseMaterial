import { RequestContext } from "../../../../request-context";
import { FlightInput } from "../../../../types";

export interface UpdateFlightInput {
  context: RequestContext;
  data: { id: number; flight: FlightInput };
}
