import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Airport, AirportCode } from "../../types";

export interface GetAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}

export interface GetAirportOutput {
  airport: Airport;
}

// GET /airports/:code - get one airport (with computed futureFlights).
export class GetAirportUseCase implements UseCase<GetAirportInput, GetAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: GetAirportInput): Promise<GetAirportOutput> {
    return { airport: this.db.getAirport(data.code) };
  }
}
