import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Airport } from "../../types";

export interface ListAirportsInput {
  context: RequestContext;
  data: Record<string, never>;
}

export interface ListAirportsOutput {
  airports: Airport[];
}

// GET /airports - list all airports (each with computed futureFlights).
export class ListAirportsUseCase implements UseCase<ListAirportsInput, ListAirportsOutput> {
  constructor(private readonly db: Database) {}

  async execute(_input: ListAirportsInput): Promise<ListAirportsOutput> {
    return { airports: this.db.listAirports() };
  }
}
