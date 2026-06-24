import { UseCase } from "../../use-case";
import { IFlightRerouteRepository } from "../flight-reroute.repository";
import { ListFlightReroutesInput } from "./types/list-flight-reroutes-input.interface";
import { ListFlightReroutesOutput } from "./types/list-flight-reroutes-output.interface";

// GET /flight-reroutes - list all reroutes.
export class ListFlightReroutesUseCase
  implements UseCase<ListFlightReroutesInput, ListFlightReroutesOutput>
{
  constructor(private readonly reroutes: IFlightRerouteRepository) {}

  async execute(_input: ListFlightReroutesInput): Promise<ListFlightReroutesOutput> {
    return { reroutes: await this.reroutes.listReroutes() };
  }
}
