import { RequestContext } from "../../../request-context";
import { AirportCode } from "../../../../domain/airport/airport";

export interface GetAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}
