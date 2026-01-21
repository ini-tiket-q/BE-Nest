import { SearchFlightQuery, FlightOffer } from './models';

export interface IFlightVendorPort {
    search(query: SearchFlightQuery): Promise<FlightOffer[]>;
}