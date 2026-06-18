import { RequestContext } from "../../../../request-context";
import { AirportCode } from "../../../../types";

export interface GetAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}
