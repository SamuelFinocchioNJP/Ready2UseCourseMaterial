import { Airport, AirportCode, AirportInput } from "../../domain/airport/airport";

// Thin persistence port for the Airport aggregate. Speaks only domain types.
// Lookups return null when absent; the use cases decide whether absence is an
// error. Mutators assume the use case has already checked preconditions
// (existence / uniqueness / no referencing flights).
export interface IAirportRepository {
    listAirports(): Promise<Airport[]>;
    findByCode(code: AirportCode): Promise<Airport | null>;
    insertAirport(input: AirportInput): Promise<Airport>;
    updateAirport(code: AirportCode, input: AirportInput): Promise<Airport>;
    deleteAirport(code: AirportCode): Promise<Airport>;
}
