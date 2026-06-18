import { UseCase } from "../../../use-case";
import { IAirportRepository } from "../../repository/airport.repository.interface";
import { IFlightRepository } from "../../../flights/repository/flight.repository.interface";
import { UpdateAirportInput } from "./types/update-airport-input.interface";
import { UpdateAirportOutput } from "./types/update-airport-output.interface";

// PUT /airports/:code - replace an airport's fields (code stays the path param).
export class UpdateAirportUseCase implements UseCase<UpdateAirportInput, UpdateAirportOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: UpdateAirportInput): Promise<UpdateAirportOutput> {
    const airport = await this.airports.updateAirport(data.code, data.airport);
    const futureFlights = await this.flights.listUpcomingByAirport(data.code);
    return { airport: { ...airport, futureFlights } };
  }
}
