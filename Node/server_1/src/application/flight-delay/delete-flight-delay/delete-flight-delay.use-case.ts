import { UseCase } from "../../use-case";
import { IFlightDelayRepository } from "../flight-delay.repository";
import { NotFoundError } from "../../../domain/errors";
import { DeleteFlightDelayInput } from "./types/delete-flight-delay-input.interface";
import { DeleteFlightDelayOutput } from "./types/delete-flight-delay-output.interface";

// DELETE /flight-delays/:id - delete a delay. The delay must exist (NotFoundError).
export class DeleteFlightDelayUseCase
  implements UseCase<DeleteFlightDelayInput, DeleteFlightDelayOutput>
{
  constructor(private readonly delays: IFlightDelayRepository) {}

  async execute({ data }: DeleteFlightDelayInput): Promise<DeleteFlightDelayOutput> {
    const existing = await this.delays.findById(data.id);
    if (!existing) throw new NotFoundError(`Flight delay ${data.id} not found`);
    await this.delays.deleteDelay(data.id);
    return { deleted: true };
  }
}
