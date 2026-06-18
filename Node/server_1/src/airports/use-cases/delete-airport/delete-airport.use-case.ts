import { UseCase } from "../../../use-case";
import { IAirportRepository } from "../../repository/airport.repository.interface";
import { DeleteAirportInput } from "./types/delete-airport-input.interface";
import { DeleteAirportOutput } from "./types/delete-airport-output.interface";

// DELETE /airports/:code - delete an airport (blocked if any flight references it).
// Returns the deleted airport. futureFlights is a read-side computed view, so this
// write use case returns the bare entity without it.
export class DeleteAirportUseCase implements UseCase<DeleteAirportInput, DeleteAirportOutput> {
  constructor(private readonly airports: IAirportRepository) {}

  async execute({ data }: DeleteAirportInput): Promise<DeleteAirportOutput> {
    const airport = await this.airports.deleteAirport(data.code);
    return { airport };
  }
}
