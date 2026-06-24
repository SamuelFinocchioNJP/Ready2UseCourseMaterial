import { UseCase } from "../../use-case";
import { IFlightDelayRepository } from "../flight-delay.repository";
import { NotFoundError } from "../../../domain/errors";
import { GetFlightDelayInput } from "./types/get-flight-delay-input.interface";
import { GetFlightDelayOutput } from "./types/get-flight-delay-output.interface";

// GET /flight-delays/:id - get one delay.
export class GetFlightDelayUseCase
  implements UseCase<GetFlightDelayInput, GetFlightDelayOutput>
{
  constructor(private readonly delays: IFlightDelayRepository) {}

  async execute({ data }: GetFlightDelayInput): Promise<GetFlightDelayOutput> {
    const delay = await this.delays.findById(data.id);
    if (!delay) throw new NotFoundError(`Flight delay ${data.id} not found`);
    return { delay };
  }
}
