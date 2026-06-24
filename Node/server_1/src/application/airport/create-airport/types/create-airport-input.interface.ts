import { RequestContext } from "../../../request-context";
import { AirportInput } from "../../../../domain/airport/airport";

export interface CreateAirportInput {
  context: RequestContext;
  data: AirportInput;
}
