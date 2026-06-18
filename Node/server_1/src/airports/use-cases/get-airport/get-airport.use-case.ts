import { UseCase } from "../../../use-case";
import { Database } from "../../../database";
import { GetAirportInput } from "./types/get-airport-input.interface";
import { GetAirportOutput } from "./types/get-airport-output.interface";

// GET /airports/:code - get one airport (with computed futureFlights).
export class GetAirportUseCase implements UseCase<GetAirportInput, GetAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: GetAirportInput): Promise<GetAirportOutput> {
    return { airport: this.db.getAirport(data.code) };
  }
}
