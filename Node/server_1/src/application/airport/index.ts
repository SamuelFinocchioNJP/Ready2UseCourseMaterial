import { IAirportRepository } from "./airport.repository";
import { IFlightRepository } from "../flight/flight.repository";
import { IFlightRerouteRepository } from "../flight-reroute/flight-reroute.repository";
import { ListAirportsUseCase } from "./list-airports/list-airports.use-case";
import { GetAirportUseCase } from "./get-airport/get-airport.use-case";
import { CreateAirportUseCase } from "./create-airport/create-airport.use-case";
import { UpdateAirportUseCase } from "./update-airport/update-airport.use-case";
import { DeleteAirportUseCase } from "./delete-airport/delete-airport.use-case";

export * from "./list-airports/list-airports.use-case";
export * from "./get-airport/get-airport.use-case";
export * from "./create-airport/create-airport.use-case";
export * from "./update-airport/update-airport.use-case";
export * from "./delete-airport/delete-airport.use-case";

// The bundle of airport use cases injected into the airports router and the import job.
export interface AirportUseCases {
  list: ListAirportsUseCase;
  get: GetAirportUseCase;
  create: CreateAirportUseCase;
  update: UpdateAirportUseCase;
  delete: DeleteAirportUseCase;
}

export function createAirportUseCases(
  airports: IAirportRepository,
  flights: IFlightRepository,
  reroutes: IFlightRerouteRepository
): AirportUseCases {
  return {
    list: new ListAirportsUseCase(airports, flights),
    get: new GetAirportUseCase(airports, flights),
    create: new CreateAirportUseCase(airports),
    update: new UpdateAirportUseCase(airports, flights),
    delete: new DeleteAirportUseCase(airports, flights, reroutes),
  };
}
