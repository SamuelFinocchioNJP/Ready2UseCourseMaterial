import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { CreateFlightInput } from "./types/create-flight-input.interface";
import { CreateFlightOutput } from "./types/create-flight-output.interface";

// POST /flights - create a flight (id is server-assigned; any client id is ignored).
export class CreateFlightUseCase implements UseCase<CreateFlightInput, CreateFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: CreateFlightInput): Promise<CreateFlightOutput> {
    return { flight: this.db.createFlight(data) };
  }
}
