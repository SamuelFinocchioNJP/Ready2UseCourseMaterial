import { UseCase } from "../../../use-case";
import { IFlightRepository } from "../../repository/flight.repository.interface";
import { GetFlightInput } from "./types/get-flight-input.interface";
import { GetFlightOutput } from "./types/get-flight-output.interface";

// GET /flights/:id - get one flight.
export class GetFlightUseCase implements UseCase<GetFlightInput, GetFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: GetFlightInput): Promise<GetFlightOutput> {
    return { flight: await this.flights.getFlight(data.id) };
  }
}
