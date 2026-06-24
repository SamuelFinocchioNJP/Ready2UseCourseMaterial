import { IFlightRerouteRepository } from "./flight-reroute.repository";
import { IFlightRepository } from "../flight/flight.repository";
import { IAirportRepository } from "../airport/airport.repository";
import { ListFlightReroutesUseCase } from "./list-flight-reroutes/list-flight-reroutes.use-case";
import { ListFlightReroutesForFlightUseCase } from "./list-flight-reroutes-for-flight/list-flight-reroutes-for-flight.use-case";
import { GetFlightRerouteUseCase } from "./get-flight-reroute/get-flight-reroute.use-case";
import { CreateFlightRerouteUseCase } from "./create-flight-reroute/create-flight-reroute.use-case";
import { DeleteFlightRerouteUseCase } from "./delete-flight-reroute/delete-flight-reroute.use-case";

export * from "./list-flight-reroutes/list-flight-reroutes.use-case";
export * from "./list-flight-reroutes-for-flight/list-flight-reroutes-for-flight.use-case";
export * from "./get-flight-reroute/get-flight-reroute.use-case";
export * from "./create-flight-reroute/create-flight-reroute.use-case";
export * from "./delete-flight-reroute/delete-flight-reroute.use-case";

// The bundle of flight-reroute use cases injected into the flight-reroutes router.
export interface FlightRerouteUseCases {
  list: ListFlightReroutesUseCase;
  listForFlight: ListFlightReroutesForFlightUseCase;
  get: GetFlightRerouteUseCase;
  create: CreateFlightRerouteUseCase;
  delete: DeleteFlightRerouteUseCase;
}

// Create needs the flight and airport repositories too, to enforce that both the
// flight and the new destination airport exist (IntegrityError) in the use-case layer.
export function createFlightRerouteUseCases(
  reroutes: IFlightRerouteRepository,
  flights: IFlightRepository,
  airports: IAirportRepository
): FlightRerouteUseCases {
  return {
    list: new ListFlightReroutesUseCase(reroutes),
    listForFlight: new ListFlightReroutesForFlightUseCase(reroutes),
    get: new GetFlightRerouteUseCase(reroutes),
    create: new CreateFlightRerouteUseCase(reroutes, flights, airports),
    delete: new DeleteFlightRerouteUseCase(reroutes),
  };
}
