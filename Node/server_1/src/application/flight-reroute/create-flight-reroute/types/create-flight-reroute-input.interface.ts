import { RequestContext } from "../../../request-context";
import { FlightRerouteInput } from "../../../../domain/flight-reroute/flight-reroute";

export interface CreateFlightRerouteInput {
  context: RequestContext;
  data: FlightRerouteInput;
}
