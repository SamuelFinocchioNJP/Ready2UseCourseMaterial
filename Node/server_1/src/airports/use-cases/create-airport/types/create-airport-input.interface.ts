import { RequestContext } from "../../../../request-context";
import { AirportInput } from "../../../../types";

export interface CreateAirportInput {
  context: RequestContext;
  data: AirportInput;
}
