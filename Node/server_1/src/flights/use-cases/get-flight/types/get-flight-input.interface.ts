import { RequestContext } from "../../../../request-context";

export interface GetFlightInput {
  context: RequestContext;
  data: { id: number };
}
