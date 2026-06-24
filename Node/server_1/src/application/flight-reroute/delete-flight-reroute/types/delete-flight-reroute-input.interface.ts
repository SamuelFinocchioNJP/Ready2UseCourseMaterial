import { RequestContext } from "../../../request-context";

export interface DeleteFlightRerouteInput {
  context: RequestContext;
  data: { id: number };
}
