import { UseCase } from "../../use-case";
import { IAirportRepository } from "../airport.repository";
import { IFlightRepository } from "../../flight/flight.repository";
import { ConflictError, NotFoundError } from "../../../domain/errors";
import { DeleteAirportInput } from "./types/delete-airport-input.interface";
import { DeleteAirportOutput } from "./types/delete-airport-output.interface";

// DELETE /airports/:code - delete an airport, blocked if any flight references it.
// Returns the deleted airport. futureFlights is a read-side computed view, so this
// write use case returns the bare entity without it.
export class DeleteAirportUseCase implements UseCase<DeleteAirportInput, DeleteAirportOutput> {
  constructor(
    private readonly airports: IAirportRepository,
    private readonly flights: IFlightRepository
  ) {}

  async execute({ data }: DeleteAirportInput): Promise<DeleteAirportOutput> {
    const existing = await this.airports.findByCode(data.code);
    if (!existing) throw new NotFoundError(`Airport "${data.code}" not found`);
    if (await this.flights.existsReferencing(data.code)) {
      throw new ConflictError(`Airport "${data.code}" cannot be deleted while flights reference it`);
    }
    const airport = await this.airports.deleteAirport(data.code);
    return { airport };
  }
}
