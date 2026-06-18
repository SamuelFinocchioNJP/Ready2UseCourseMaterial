import { RequestContext } from "../../../../request-context";

export interface DeleteFlightInput {
  context: RequestContext;
  data: { id: number };
}
