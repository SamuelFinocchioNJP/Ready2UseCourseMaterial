import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { UpdateFlightInput } from "./types/update-flight-input.interface";
import { UpdateFlightOutput } from "./types/update-flight-output.interface";

// PUT /flights/:id - update a flight.
export class UpdateFlightUseCase implements UseCase<UpdateFlightInput, UpdateFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: UpdateFlightInput): Promise<UpdateFlightOutput> {
    return { flight: this.db.updateFlight(data.id, data.flight) };
  }
}
