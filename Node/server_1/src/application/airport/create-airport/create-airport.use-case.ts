import { UseCase } from "../../use-case";
import { IAirportRepository } from "../airport.repository";
import { ConflictError } from "../../../domain/errors";
import { CreateAirportInput } from "./types/create-airport-input.interface";
import { CreateAirportOutput } from "./types/create-airport-output.interface";

// POST /airports - create an airport. A duplicate code is a ConflictError.
// futureFlights is a read-side computed view, so this write use case returns the
// bare entity without it.
export class CreateAirportUseCase implements UseCase<CreateAirportInput, CreateAirportOutput> {
  constructor(private readonly airports: IAirportRepository) {}

  async execute({ data }: CreateAirportInput): Promise<CreateAirportOutput> {
    const existing = await this.airports.findByCode(data.code);
    if (existing) throw new ConflictError(`Airport "${data.code}" already exists`);
    const airport = await this.airports.insertAirport(data);
    return { airport };
  }
}
