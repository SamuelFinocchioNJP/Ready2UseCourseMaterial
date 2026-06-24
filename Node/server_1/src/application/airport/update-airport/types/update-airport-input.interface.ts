import { RequestContext } from "../../../request-context";
import { AirportCode, AirportInput } from "../../../../domain/airport/airport";

export interface UpdateAirportInput {
  context: RequestContext;
  data: { code: AirportCode; airport: AirportInput };
}
