import { FlightOffer, SearchFlightQuery } from "./models";

export interface IFlightVendorPort {
    searchFlights(query: SearchFlightQuery): Promise<FlightOffer[]>;
}