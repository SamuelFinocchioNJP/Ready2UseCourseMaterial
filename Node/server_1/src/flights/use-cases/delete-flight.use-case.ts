import { UseCase } from "../../use-case";
import { RequestContext } from "../../request-context";
import { Database } from "../../database";

export interface DeleteFlightInput {
  context: RequestContext;
  data: { id: number };
}

export interface DeleteFlightOutput {
  deleted: true;
}

// DELETE /flights/:id - delete a flight.
export class DeleteFlightUseCase implements UseCase<DeleteFlightInput, DeleteFlightOutput> {
  constructor(private readonly db: Database) {}

  async execute({ data }: DeleteFlightInput): Promise<DeleteFlightOutput> {
    this.db.deleteFlight(data.id);
    return { deleted: true };
  }
}
