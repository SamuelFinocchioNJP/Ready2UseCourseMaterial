import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Flight, FlightInput } from "../../types";

export interface UpdateFlightInput {
  context: RequestContext;
  data: { id: number; flight: FlightInput };
}

export interface UpdateFlightOutput {
  flight: Flight;
}

// PUT /flights/:id - update a flight.
export class UpdateFlightUseCase implements UseCase<UpdateFlightInput, UpdateFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: UpdateFlightInput): Promise<UpdateFlightOutput> {
    return { flight: this.db.updateFlight(data.id, data.flight) };
  }
}
