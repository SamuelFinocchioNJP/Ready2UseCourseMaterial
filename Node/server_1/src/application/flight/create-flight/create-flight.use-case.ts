import { UseCase } from "../../use-case";
import { IFlightRepository } from "../flight.repository";
import { IAirportRepository } from "../../airport/airport.repository";
import { assertAirportsExist } from "../assert-airports-exist";
import { CreateFlightInput } from "./types/create-flight-input.interface";
import { CreateFlightOutput } from "./types/create-flight-output.interface";

// POST /flights - create a flight (id is server-assigned; any client id is ignored).
// Both endpoint airports must exist (IntegrityError otherwise).
export class CreateFlightUseCase implements UseCase<CreateFlightInput, CreateFlightOutput> {
  constructor(
    private readonly flights: IFlightRepository,
    private readonly airports: IAirportRepository
  ) {}

  async execute({ data }: CreateFlightInput): Promise<CreateFlightOutput> {
    await assertAirportsExist(this.airports, data.source, data.destination);
    return { flight: await this.flights.insertFlight(data) };
  }
}
