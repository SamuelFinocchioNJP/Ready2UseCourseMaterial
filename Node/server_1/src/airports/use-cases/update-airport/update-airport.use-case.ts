import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { UpdateAirportInput } from "./types/update-airport-input.interface";
import { UpdateAirportOutput } from "./types/update-airport-output.interface";

// PUT /airports/:code - replace an airport's fields (code stays the path param).
export class UpdateAirportUseCase implements UseCase<UpdateAirportInput, UpdateAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: UpdateAirportInput): Promise<UpdateAirportOutput> {
    return { airport: this.db.updateAirport(data.code, data.airport) };
  }
}
