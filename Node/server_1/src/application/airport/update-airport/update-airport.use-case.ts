import { UseCase } from "../../use-case";
import { IAirportRepository } from "../airport.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { NotFoundError } from "../../../domain/errors";
import { UpdateAirportInput } from "./types/update-airport-input.interface";
import { UpdateAirportOutput } from "./types/update-airport-output.interface";

// PUT /airports/:code - replace an airport's fields (code stays the path param).
export class UpdateAirportUseCase implements UseCase<UpdateAirportInput, UpdateAirportOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: UpdateAirportInput): Promise<UpdateAirportOutput> {
    const existing = await this.airports.findByCode(data.code);
    if (!existing) throw new NotFoundError(`Airport "${data.code}" not found`);
    const airport = await this.airports.updateAirport(data.code, data.airport);
    const futureFlights = await this.flights.listUpcomingByAirport(data.code);
    return { airport: { ...airport, futureFlights } };
  }
}
