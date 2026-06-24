import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { ListFlightsInput } from "./types/list-flights-input.interface";
import { ListFlightsOutput } from "./types/list-flights-output.interface";

// GET /flights - list all flights.
export class ListFlightsUseCase implements UseCase<ListFlightsInput, ListFlightsOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute(_input: ListFlightsInput): Promise<ListFlightsOutput> {
    return { flights: await this.flights.listFlights() };
  }
}
