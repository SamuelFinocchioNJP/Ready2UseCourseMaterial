import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { DeleteAirportInput } from "./types/delete-airport-input.interface";
import { DeleteAirportOutput } from "./types/delete-airport-output.interface";

// DELETE /airports/:code - delete an airport (blocked if any flight references it).
// Returns the deleted airport.
export class DeleteAirportUseCase implements UseCase<DeleteAirportInput, DeleteAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: DeleteAirportInput): Promise<DeleteAirportOutput> {
    return { airport: this.db.deleteAirport(data.code) };
  }
}
