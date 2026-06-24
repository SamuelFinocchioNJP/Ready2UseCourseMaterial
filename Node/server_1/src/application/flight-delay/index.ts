import { IFlightDelayRepository } from "./flight-delay.repository";
import { IFlightRepository } from "../flight/flight.repository";
import { ListFlightDelaysUseCase } from "./list-flight-delays/list-flight-delays.use-case";
import { ListFlightDelaysForFlightUseCase } from "./list-flight-delays-for-flight/list-flight-delays-for-flight.use-case";
import { GetFlightDelayUseCase } from "./get-flight-delay/get-flight-delay.use-case";
import { CreateFlightDelayUseCase } from "./create-flight-delay/create-flight-delay.use-case";
import { DeleteFlightDelayUseCase } from "./delete-flight-delay/delete-flight-delay.use-case";

export * from "./list-flight-delays/list-flight-delays.use-case";
export * from "./list-flight-delays-for-flight/list-flight-delays-for-flight.use-case";
export * from "./get-flight-delay/get-flight-delay.use-case";
export * from "./create-flight-delay/create-flight-delay.use-case";
export * from "./delete-flight-delay/delete-flight-delay.use-case";

// The bundle of flight-delay use cases injected into the flight-delays router.
export interface FlightDelayUseCases {
  list: ListFlightDelaysUseCase;
  listForFlight: ListFlightDelaysForFlightUseCase;
  get: GetFlightDelayUseCase;
  create: CreateFlightDelayUseCase;
  delete: DeleteFlightDelayUseCase;
}

// Create needs the flight repository too, to enforce that the referenced flight
// exists (IntegrityError) inside the use-case layer.
export function createFlightDelayUseCases(
  delays: IFlightDelayRepository,
  flights: IFlightRepository
): FlightDelayUseCases {
  return {
    list: new ListFlightDelaysUseCase(delays),
    listForFlight: new ListFlightDelaysForFlightUseCase(delays),
    get: new GetFlightDelayUseCase(delays),
    create: new CreateFlightDelayUseCase(delays, flights),
    delete: new DeleteFlightDelayUseCase(delays),
  };
}
