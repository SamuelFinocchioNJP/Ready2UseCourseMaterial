import { RequestContext } from "../../../../request-context";
import { AirportCode } from "../../../../types";

export interface ListFlightsFromInput {
  context: RequestContext;
  data: { source: AirportCode };
}
