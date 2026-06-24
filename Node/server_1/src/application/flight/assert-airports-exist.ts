import { IAirportRepository } from "../airport/airport.repository";
import { AirportCode } from "../../domain/airport/airport";
import { IntegrityError } from "../../domain/errors";

// Referential integrity for flights: both endpoints must reference existing airports.
// Source is checked first so the error names the source when both are unknown
// (preserving the original 400 message contract).
export async function assertAirportsExist(
  airports: IAirportRepository,
  source: AirportCode,
  destination: AirportCode
): Promise<void> {
  if ((await airports.findByCode(source)) === null) {
    throw new IntegrityError(`Unknown airport "${source}"`);
  }
  if ((await airports.findByCode(destination)) === null) {
    throw new IntegrityError(`Unknown airport "${destination}"`);
  }
}
