import { UseCase } from "../../use-case";
import { IAirportRepository } from "../airport.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { ListAirportsInput } from "./types/list-airports-input.interface";
import { ListAirportsOutput } from "./types/list-airports-output.interface";

// GET /airports - list all airports, each with its computed upcoming-departures view.
export class ListAirportsUseCase implements UseCase<ListAirportsInput, ListAirportsOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) { }

  async execute(_input: ListAirportsInput): Promise<ListAirportsOutput> {
    const airports = await this.airports.listAirports();
    const withFlights = await Promise.all(
      airports.map(async (airport) => ({
        ...airport,
        futureFlights: await this.flights.listUpcomingByAirport(airport.code),
      }))
    );
    return { airports: withFlights };
  }
}
