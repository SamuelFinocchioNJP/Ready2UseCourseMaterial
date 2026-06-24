import { UseCase } from "../../use-case";
import { IFlightDelayRepository } from "../flight-delay.repository";
import { ListFlightDelaysInput } from "./types/list-flight-delays-input.interface";
import { ListFlightDelaysOutput } from "./types/list-flight-delays-output.interface";

// GET /flight-delays - list all delays.
export class ListFlightDelaysUseCase
  implements UseCase<ListFlightDelaysInput, ListFlightDelaysOutput>
{
  constructor(private readonly delays: IFlightDelayRepository) {}

  async execute(_input: ListFlightDelaysInput): Promise<ListFlightDelaysOutput> {
    return { delays: await this.delays.listDelays() };
  }
}
