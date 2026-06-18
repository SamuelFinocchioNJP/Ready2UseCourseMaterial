import { IFlightRepository } from "../repository/flight.repository.interface";
import { ListFlightsUseCase } from "./list-flights/list-flights.use-case";
import { ListFlightsFromUseCase } from "./list-flights-from/list-flights-from.use-case";
import { GetFlightUseCase } from "./get-flight/get-flight.use-case";
import { CreateFlightUseCase } from "./create-flight/create-flight.use-case";
import { UpdateFlightUseCase } from "./update-flight/update-flight.use-case";
import { DeleteFlightUseCase } from "./delete-flight/delete-flight.use-case";

export * from "./list-flights/list-flights.use-case";
export * from "./list-flights-from/list-flights-from.use-case";
export * from "./get-flight/get-flight.use-case";
export * from "./create-flight/create-flight.use-case";
export * from "./update-flight/update-flight.use-case";
export * from "./delete-flight/delete-flight.use-case";

// The bundle of flight use cases injected into the flights router.
export interface FlightUseCases {
  list: ListFlightsUseCase;
  listFrom: ListFlightsFromUseCase;
  get: GetFlightUseCase;
  create: CreateFlightUseCase;
  update: UpdateFlightUseCase;
  delete: DeleteFlightUseCase;
}

export function createFlightUseCases(flights: IFlightRepository): FlightUseCases {
  return {
    list: new ListFlightsUseCase(flights),
    listFrom: new ListFlightsFromUseCase(flights),
    get: new GetFlightUseCase(flights),
    create: new CreateFlightUseCase(flights),
    update: new UpdateFlightUseCase(flights),
    delete: new DeleteFlightUseCase(flights),
  };
}
