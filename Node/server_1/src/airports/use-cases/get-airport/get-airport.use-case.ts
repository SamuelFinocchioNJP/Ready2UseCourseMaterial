import { UseCase } from "../../../use-case";
import { IAirportRepository } from "../../repository/airport.repository.interface";
import { IFlightRepository } from "../../../flights/repository/flight.repository.interface";
import { GetAirportInput } from "./types/get-airport-input.interface";
import { GetAirportOutput } from "./types/get-airport-output.interface";

// GET /airports/:code - get one airport with its computed upcoming-departures view.
export class GetAirportUseCase implements UseCase<GetAirportInput, GetAirportOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: GetAirportInput): Promise<GetAirportOutput> {
    const airport = await this.airports.getAirport(data.code);
    const futureFlights = await this.flights.listUpcomingByAirport(data.code);
    return { airport: { ...airport, futureFlights } };
  }
}
