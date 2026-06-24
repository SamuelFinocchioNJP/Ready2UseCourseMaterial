import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { ListFlightsFromInput } from "./types/list-flights-from-input.interface";
import { ListFlightsFromOutput } from "./types/list-flights-from-output.interface";

// GET /flights?source=XXX - flights departing from airport XXX.
export class ListFlightsFromUseCase
  implements UseCase<ListFlightsFromInput, ListFlightsFromOutput>
{
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: ListFlightsFromInput): Promise<ListFlightsFromOutput> {
    return { flights: await this.flights.flightsFrom(data.source) };
  }
}
