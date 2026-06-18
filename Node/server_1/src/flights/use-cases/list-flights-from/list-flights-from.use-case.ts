import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { ListFlightsFromInput } from "./types/list-flights-from-input.interface";
import { ListFlightsFromOutput } from "./types/list-flights-from-output.interface";

// GET /flights?source=XXX - flights departing from airport XXX.
export class ListFlightsFromUseCase
  implements UseCase<ListFlightsFromInput, ListFlightsFromOutput>
{
  constructor(private readonly db: Database) {}

  async execute({ data }: ListFlightsFromInput): Promise<ListFlightsFromOutput> {
    return { flights: this.db.flightsFrom(data.source) };
  }
}
