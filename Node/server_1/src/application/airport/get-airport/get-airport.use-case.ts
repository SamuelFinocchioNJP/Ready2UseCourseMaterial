import { UseCase } from "../../use-case";
import { IAirportRepository } from "../airport.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { NotFoundError } from "../../../domain/errors";
import { GetAirportInput } from "./types/get-airport-input.interface";
import { GetAirportOutput } from "./types/get-airport-output.interface";

// GET /airports/:code - get one airport with its computed upcoming-departures view.
export class GetAirportUseCase implements UseCase<GetAirportInput, GetAirportOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: GetAirportInput): Promise<GetAirportOutput> {
    const airport = await this.airports.findByCode(data.code);
    if (!airport) throw new NotFoundError(`Airport "${data.code}" not found`);
    const futureFlights = await this.flights.listUpcomingByAirport(data.code);
    return { airport: { ...airport, futureFlights } };
  }
}
