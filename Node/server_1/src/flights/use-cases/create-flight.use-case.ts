import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Flight, FlightInput } from "../../types";

export interface CreateFlightInput {
  context: RequestContext;
  data: FlightInput;
}

export interface CreateFlightOutput {
  flight: Flight;
}

// POST /flights - create a flight (id is server-assigned; any client id is ignored).
export class CreateFlightUseCase implements UseCase<CreateFlightInput, CreateFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: CreateFlightInput): Promise<CreateFlightOutput> {
    return { flight: this.db.createFlight(data) };
  }
}
