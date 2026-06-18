import { UseCase } from "../../../use-case";
import { IAirportRepository } from "../../repository/airport.repository.interface";
import { CreateAirportInput } from "./types/create-airport-input.interface";
import { CreateAirportOutput } from "./types/create-airport-output.interface";

// POST /airports - create an airport. futureFlights is a read-side computed view,
// so this write use case returns the bare entity without it.
export class CreateAirportUseCase implements UseCase<CreateAirportInput, CreateAirportOutput> {
  constructor(private readonly airports: IAirportRepository) {}

  async execute({ data }: CreateAirportInput): Promise<CreateAirportOutput> {
    const airport = await this.airports.createAirport(data);
    return { airport };
  }
}
