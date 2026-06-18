import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { GetFlightInput } from "./types/get-flight-input.interface";
import { GetFlightOutput } from "./types/get-flight-output.interface";

// GET /flights/:id - get one flight.
export class GetFlightUseCase implements UseCase<GetFlightInput, GetFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: GetFlightInput): Promise<GetFlightOutput> {
    return { flight: this.db.getFlight(data.id) };
  }
}
