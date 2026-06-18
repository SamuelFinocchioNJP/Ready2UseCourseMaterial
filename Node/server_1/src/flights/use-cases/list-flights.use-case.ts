import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Flight } from "../../types";

export interface ListFlightsInput {
  context: RequestContext;
  data: Record<string, never>;
}

export interface ListFlightsOutput {
  flights: Flight[];
}

// GET /flights - list all flights.
export class ListFlightsUseCase implements UseCase<ListFlightsInput, ListFlightsOutput> {
  constructor(private readonly db: Database) {}

  async execute(_input: ListFlightsInput): Promise<ListFlightsOutput> {
    return { flights: this.db.listFlights() };
  }
}
