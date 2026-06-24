import { RequestContext } from "../../../request-context";

export interface DeleteFlightDelayInput {
  context: RequestContext;
  data: { id: number };
}
