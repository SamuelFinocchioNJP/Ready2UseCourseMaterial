import { UseCase } from "../../../use-case";
import { IFlightRepository } from "../../repository/flight.repository.interface";
import { CreateFlightInput } from "./types/create-flight-input.interface";
import { CreateFlightOutput } from "./types/create-flight-output.interface";

// POST /flights - create a flight (id is server-assigned; any client id is ignored).
export class CreateFlightUseCase implements UseCase<CreateFlightInput, CreateFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: CreateFlightInput): Promise<CreateFlightOutput> {
    return { flight: await this.flights.createFlight(data) };
  }
}
