import { RequestContext } from "../../../request-context";
import { AirportCode } from "../../../../domain/airport/airport";

export interface DeleteAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}
