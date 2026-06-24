import { RequestContext } from "../../../request-context";

export interface ListFlightDelaysForFlightInput {
  context: RequestContext;
  data: { flightId: number };
}
