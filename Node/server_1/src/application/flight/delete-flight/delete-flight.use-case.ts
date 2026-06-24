import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { NotFoundError } from "../../../domain/errors";
import { DeleteFlightInput } from "./types/delete-flight-input.interface";
import { DeleteFlightOutput } from "./types/delete-flight-output.interface";

// DELETE /flights/:id - delete a flight. The flight must exist (NotFoundError).
export class DeleteFlightUseCase implements UseCase<DeleteFlightInput, DeleteFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: DeleteFlightInput): Promise<DeleteFlightOutput> {
    const existing = await this.flights.findById(data.id);
    if (!existing) throw new NotFoundError(`Flight ${data.id} not found`);
    await this.flights.deleteFlight(data.id);
    return { deleted: true };
  }
}
