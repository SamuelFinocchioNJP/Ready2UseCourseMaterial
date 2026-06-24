import { RequestContext } from "../../../request-context";

export interface ListFlightReroutesForFlightInput {
  context: RequestContext;
  data: { flightId: number };
}
