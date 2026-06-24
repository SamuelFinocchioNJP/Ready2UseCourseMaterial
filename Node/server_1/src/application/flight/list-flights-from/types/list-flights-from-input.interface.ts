import { RequestContext } from "../../../request-context";
import { AirportCode } from "../../../../domain/airport/airport";

export interface ListFlightsFromInput {
  context: RequestContext;
  data: { source: AirportCode };
}
