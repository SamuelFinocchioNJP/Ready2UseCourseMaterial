import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Airport, AirportCode, AirportInput } from "../../types";

export interface UpdateAirportInput {
  context: RequestContext;
  data: { code: AirportCode; airport: AirportInput };
}

export interface UpdateAirportOutput {
  airport: Airport;
}

// PUT /airports/:code - replace an airport's fields (code stays the path param).
export class UpdateAirportUseCase implements UseCase<UpdateAirportInput, UpdateAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: UpdateAirportInput): Promise<UpdateAirportOutput> {
    return { airport: this.db.updateAirport(data.code, data.airport) };
  }
}
