import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { AirportCode, Flight } from "../../types";

export interface ListFlightsFromInput {
  context: RequestContext;
  data: { source: AirportCode };
}

export interface ListFlightsFromOutput {
  flights: Flight[];
}

// GET /flights?source=XXX - flights departing from airport XXX.
export class ListFlightsFromUseCase
  implements UseCase<ListFlightsFromInput, ListFlightsFromOutput>
{
  constructor(private readonly db: Database) {}

  async execute({ data }: ListFlightsFromInput): Promise<ListFlightsFromOutput> {
    return { flights: this.db.flightsFrom(data.source) };
  }
}
