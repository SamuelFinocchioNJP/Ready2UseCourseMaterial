import { RequestContext } from "../../../request-context";

export interface GetFlightRerouteInput {
  context: RequestContext;
  data: { id: number };
}
