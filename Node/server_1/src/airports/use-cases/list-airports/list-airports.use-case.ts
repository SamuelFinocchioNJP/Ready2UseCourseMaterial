import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { ListAirportsInput } from "./types/list-airports-input.interface";
import { ListAirportsOutput } from "./types/list-airports-output.interface";

// GET /airports - list all airports (each with computed futureFlights).
export class ListAirportsUseCase implements UseCase<ListAirportsInput, ListAirportsOutput> {
  constructor(private readonly db: Database) {}

  async execute(_input: ListAirportsInput): Promise<ListAirportsOutput> {
    return { airports: this.db.listAirports() };
  }
}
