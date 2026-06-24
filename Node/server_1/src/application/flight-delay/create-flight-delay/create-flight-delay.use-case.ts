import { UseCase } from "../../use-case";
import { IFlightDelayRepository } from "../flight-delay.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { assertFlightExists } from "../../flight/assert-flight-exists";
import { CreateFlightDelayInput } from "./types/create-flight-delay-input.interface";
import { CreateFlightDelayOutput } from "./types/create-flight-delay-output.interface";

// POST /flight-delays - record a delay for a flight. The flight must exist
// (IntegrityError otherwise). id and createdAt are server-assigned.
export class CreateFlightDelayUseCase
  implements UseCase<CreateFlightDelayInput, CreateFlightDelayOutput>
{
  constructor(
    private readonly delays: IFlightDelayRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: CreateFlightDelayInput): Promise<CreateFlightDelayOutput> {
    await assertFlightExists(this.flights, data.flightId);
    return { delay: await this.delays.insertDelay(data) };
  }
}
