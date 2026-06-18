import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { ListFlightsInput } from "./types/list-flights-input.interface";
import { ListFlightsOutput } from "./types/list-flights-output.interface";

// GET /flights - list all flights.
export class ListFlightsUseCase implements UseCase<ListFlightsInput, ListFlightsOutput> {
  constructor(private readonly db: Database) {}

  async execute(_input: ListFlightsInput): Promise<ListFlightsOutput> {
    return { flights: this.db.listFlights() };
  }
}
