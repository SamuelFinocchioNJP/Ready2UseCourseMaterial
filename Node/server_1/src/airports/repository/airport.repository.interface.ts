import { Airport, AirportCode, AirportInput } from "../../types";

export interface IAirportRepository {
    listAirports(): Promise<Airport[]>;
    getAirport(id: AirportCode): Promise<Airport>;
    createAirport(input: AirportInput): Promise<Airport>;
    updateAirport(id: AirportCode, input: AirportInput): Promise<Airport>;
    deleteAirport(id: AirportCode): Promise<Airport>;
}
