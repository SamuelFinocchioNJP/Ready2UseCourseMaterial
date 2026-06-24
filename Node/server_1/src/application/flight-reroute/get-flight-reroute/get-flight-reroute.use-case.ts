import { UseCase } from "../../use-case";
import { IFlightRerouteRepository } from "../flight-reroute.repository";
import { NotFoundError } from "../../../domain/errors";
import { GetFlightRerouteInput } from "./types/get-flight-reroute-input.interface";
import { GetFlightRerouteOutput } from "./types/get-flight-reroute-output.interface";

// GET /flight-reroutes/:id - get one reroute.
export class GetFlightRerouteUseCase
  implements UseCase<GetFlightRerouteInput, GetFlightRerouteOutput>
{
  constructor(private readonly reroutes: IFlightRerouteRepository) {}

  async execute({ data }: GetFlightRerouteInput): Promise<GetFlightRerouteOutput> {
    const reroute = await this.reroutes.findById(data.id);
    if (!reroute) throw new NotFoundError(`Flight reroute ${data.id} not found`);
    return { reroute };
  }
}
