import { UseCase } from "../../use-case";
import { IFlightRerouteRepository } from "../flight-reroute.repository";
import { ListFlightReroutesForFlightInput } from "./types/list-flight-reroutes-for-flight-input.interface";
import { ListFlightReroutesForFlightOutput } from "./types/list-flight-reroutes-for-flight-output.interface";

// GET /flight-reroutes?flightId=N - a single flight's reroute history (oldest first).
export class ListFlightReroutesForFlightUseCase
  implements UseCase<ListFlightReroutesForFlightInput, ListFlightReroutesForFlightOutput>
{
  constructor(private readonly reroutes: IFlightRerouteRepository) {}

  async execute({
    data,
  }: ListFlightReroutesForFlightInput): Promise<ListFlightReroutesForFlightOutput> {
    return { reroutes: await this.reroutes.reroutesForFlight(data.flightId) };
  }
}
