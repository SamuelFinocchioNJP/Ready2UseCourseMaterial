import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";
import { Airport, AirportCode } from "../../types";

export interface DeleteAirportInput {
  context: RequestContext;
  data: { code: AirportCode };
}

export interface DeleteAirportOutput {
  airport: Airport;
}

// DELETE /airports/:code - delete an airport (blocked if any flight references it).
// Returns the deleted airport.
export class DeleteAirportUseCase implements UseCase<DeleteAirportInput, DeleteAirportOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: DeleteAirportInput): Promise<DeleteAirportOutput> {
    return { airport: this.db.deleteAirport(data.code) };
  }
}
