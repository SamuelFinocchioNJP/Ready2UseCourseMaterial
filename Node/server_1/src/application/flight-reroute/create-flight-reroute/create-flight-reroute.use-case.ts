import { UseCase } from "../../use-case";
import { IFlightRerouteRepository } from "../flight-reroute.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { IAirportRepository } from "../../airport/airport.repository";
import { assertFlightExists } from "../../flight/assert-flight-exists";
import { IntegrityError } from "../../../domain/errors";
import { CreateFlightRerouteInput } from "./types/create-flight-reroute-input.interface";
import { CreateFlightRerouteOutput } from "./types/create-flight-reroute-output.interface";

// POST /flight-reroutes - record a reroute for a flight. Both the flight and the
// new destination airport must exist (IntegrityError otherwise). id and createdAt
// are server-assigned.
export class CreateFlightRerouteUseCase
  implements UseCase<CreateFlightRerouteInput, CreateFlightRerouteOutput>
{
  constructor(
    private readonly reroutes: IFlightRerouteRepository,
    private readonly flights: IFlightRepository,
    private readonly airports: IAirportRepository
  ) {}

  async execute({ data }: CreateFlightRerouteInput): Promise<CreateFlightRerouteOutput> {
    await assertFlightExists(this.flights, data.flightId);
    if ((await this.airports.findByCode(data.newDestination)) === null) {
      throw new IntegrityError(`Unknown airport "${data.newDestination}"`);
    }
    return { reroute: await this.reroutes.insertReroute(data) };
  }
}
