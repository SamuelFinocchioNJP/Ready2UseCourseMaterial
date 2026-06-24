import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { NotFoundError } from "../../../domain/errors";
import { GetFlightInput } from "./types/get-flight-input.interface";
import { GetFlightOutput } from "./types/get-flight-output.interface";

// GET /flights/:id - get one flight.
export class GetFlightUseCase implements UseCase<GetFlightInput, GetFlightOutput> {
  constructor(private readonly flights: IFlightRepository) {}

  async execute({ data }: GetFlightInput): Promise<GetFlightOutput> {
    const flight = await this.flights.findById(data.id);
    if (!flight) throw new NotFoundError(`Flight ${data.id} not found`);
    return { flight };
  }
}
