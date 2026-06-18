import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Flight } from "../../types";

export interface GetFlightInput {
  context: RequestContext;
  data: { id: number };
}

export interface GetFlightOutput {
  flight: Flight;
}

// GET /flights/:id - get one flight.
export class GetFlightUseCase implements UseCase<GetFlightInput, GetFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: GetFlightInput): Promise<GetFlightOutput> {
    return { flight: this.db.getFlight(data.id) };
  }
}
