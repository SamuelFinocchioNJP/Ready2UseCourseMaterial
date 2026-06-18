import { UseCase } from "../../../use-case";
import { IFlightRepository } from "../../repository/flight.repository.interface";
import { UpdateFlightInput } from "./types/update-flight-input.interface";
import { UpdateFlightOutput } from "./types/update-flight-output.interface";

// PUT /flights/:id - update a flight.
export class UpdateFlightUseCase implements UseCase<UpdateFlightInput, UpdateFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: UpdateFlightInput): Promise<UpdateFlightOutput> {
    return { flight: await this.flights.updateFlight(data.id, data.flight) };
  }
}
