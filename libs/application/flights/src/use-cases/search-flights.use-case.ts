export class SearchFlightsUseCase {
  async execute(query: SearchFlightsQuery) {
    const { origin, destination, date, minPrice, maxPrice, airline, stops } = query;

    let flights = await this.flightVendor.searchFlights(origin, destination, date);

    // Apply filters
    if (minPrice !== undefined) {
      flights = flights.filter(f => f.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      flights = flights.filter(f => f.price <= maxPrice);
    }
    if (airline) {
      flights = flights.filter(f => f.airlineId === airline);
    }
    if (stops === '0') {
      flights = flights.filter(f => f.stops === 0);
    }

    return flights;
  }
}

export interface SearchFlightsQuery {
  origin: string;
  destination: string;
  date: Date;
  minPrice?: number;
  maxPrice?: number;
  airline?: string;
  stops?: '0' | '1' | '2+';
}