import { RequestContext } from "../../../../request-context";
import { AirportCode } from "../../../../types";

export interface DeleteAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}
