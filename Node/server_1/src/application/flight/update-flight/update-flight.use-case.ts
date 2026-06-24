import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { IAirportRepository } from "../../airport/airport.repository";
import { assertAirportsExist } from "../assert-airports-exist";
import { NotFoundError } from "../../../domain/errors";
import { UpdateFlightInput } from "./types/update-flight-input.interface";
import { UpdateFlightOutput } from "./types/update-flight-output.interface";

// PUT /flights/:id - update a flight. The flight must exist (NotFoundError) and
// both endpoint airports must exist (IntegrityError).
export class UpdateFlightUseCase implements UseCase<UpdateFlightInput, UpdateFlightOutput> {
  constructor(
    private readonly flights: IFlightRepository,
    private readonly airports: IAirportRepository
  ) {}

  async execute({ data }: UpdateFlightInput): Promise<UpdateFlightOutput> {
    const existing = await this.flights.findById(data.id);
    if (!existing) throw new NotFoundError(`Flight ${data.id} not found`);
    await assertAirportsExist(this.airports, data.flight.source, data.flight.destination);
    return { flight: await this.flights.updateFlight(data.id, data.flight) };
  }
}
