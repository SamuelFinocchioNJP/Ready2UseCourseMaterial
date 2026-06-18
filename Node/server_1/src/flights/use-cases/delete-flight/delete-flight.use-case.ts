import { UseCase } from "../../../use-case";
import { IFlightRepository } from "../../repository/flight.repository.interface";
import { DeleteFlightInput } from "./types/delete-flight-input.interface";
import { DeleteFlightOutput } from "./types/delete-flight-output.interface";

// DELETE /flights/:id - delete a flight.
export class DeleteFlightUseCase implements UseCase<DeleteFlightInput, DeleteFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: DeleteFlightInput): Promise<DeleteFlightOutput> {
    await this.flights.deleteFlight(data.id);
    return { deleted: true };
  }
}
