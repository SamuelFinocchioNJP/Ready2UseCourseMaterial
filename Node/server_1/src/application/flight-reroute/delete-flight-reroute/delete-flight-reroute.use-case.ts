import { UseCase } from "../../use-case";
import { IFlightRerouteRepository } from "../flight-reroute.repository";
import { NotFoundError } from "../../../domain/errors";
import { DeleteFlightRerouteInput } from "./types/delete-flight-reroute-input.interface";
import { DeleteFlightRerouteOutput } from "./types/delete-flight-reroute-output.interface";

// DELETE /flight-reroutes/:id - delete a reroute. The reroute must exist (NotFoundError).
export class DeleteFlightRerouteUseCase
  implements UseCase<DeleteFlightRerouteInput, DeleteFlightRerouteOutput>
{
  constructor(private readonly reroutes: IFlightRerouteRepository) {}

  async execute({ data }: DeleteFlightRerouteInput): Promise<DeleteFlightRerouteOutput> {
    const existing = await this.reroutes.findById(data.id);
    if (!existing) throw new NotFoundError(`Flight reroute ${data.id} not found`);
    await this.reroutes.deleteReroute(data.id);
    return { deleted: true };
  }
}
