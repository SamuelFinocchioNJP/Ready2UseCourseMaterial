import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { DeleteFlightInput } from "./types/delete-flight-input.interface";
import { DeleteFlightOutput } from "./types/delete-flight-output.interface";

// DELETE /flights/:id - delete a flight.
export class DeleteFlightUseCase implements UseCase<DeleteFlightInput, DeleteFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: DeleteFlightInput): Promise<DeleteFlightOutput> {
    this.db.deleteFlight(data.id);
    return { deleted: true };
  }
}
