import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { CreateAirportInput } from "./types/create-airport-input.interface";
import { CreateAirportOutput } from "./types/create-airport-output.interface";

// POST /airports - create an airport.
export class CreateAirportUseCase implements UseCase<CreateAirportInput, CreateAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: CreateAirportInput): Promise<CreateAirportOutput> {
    return { airport: this.db.createAirport(data) };
  }
}
