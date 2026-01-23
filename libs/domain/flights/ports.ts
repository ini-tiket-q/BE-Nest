import { SearchFlightQuery, FlightOffer } from './models';

export interface IFlightVendorPort {
    searchFlights(query: SearchFlightQuery): Promise<FlightOffer[]>;
}