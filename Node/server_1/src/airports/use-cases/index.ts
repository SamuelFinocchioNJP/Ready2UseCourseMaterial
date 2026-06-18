import { Database } from "../../database";
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

export function createAirportUseCases(db: Database): AirportUseCases {
  return {
    list: new ListAirportsUseCase(db),
    get: new GetAirportUseCase(db),
    create: new CreateAirportUseCase(db),
    update: new UpdateAirportUseCase(db),
    delete: new DeleteAirportUseCase(db),
  };
}
