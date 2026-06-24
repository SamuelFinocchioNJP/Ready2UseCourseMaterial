import { RequestContext } from "../../../request-context";

export interface GetFlightDelayInput {
  context: RequestContext;
  data: { id: number };
}
