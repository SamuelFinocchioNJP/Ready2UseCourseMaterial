import { UseCase } from "../../use-case";
import { IFlightDelayRepository } from "../flight-delay.repository";
import { ListFlightDelaysForFlightInput } from "./types/list-flight-delays-for-flight-input.interface";
import { ListFlightDelaysForFlightOutput } from "./types/list-flight-delays-for-flight-output.interface";

// GET /flight-delays?flightId=N - a single flight's delay history (oldest first).
export class ListFlightDelaysForFlightUseCase
  implements UseCase<ListFlightDelaysForFlightInput, ListFlightDelaysForFlightOutput>
{
  constructor(private readonly delays: IFlightDelayRepository) {}

  async execute({ data }: ListFlightDelaysForFlightInput): Promise<ListFlightDelaysForFlightOutput> {
    return { delays: await this.delays.delaysForFlight(data.flightId) };
  }
}
