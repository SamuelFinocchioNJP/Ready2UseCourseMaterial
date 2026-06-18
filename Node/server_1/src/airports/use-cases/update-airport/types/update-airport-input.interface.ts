import { RequestContext } from "../../../../request-context";
import { AirportCode, AirportInput } from "../../../../types";

export interface UpdateAirportInput {
  context: RequestContext;
  data: { code: AirportCode; airport: AirportInput };
}
