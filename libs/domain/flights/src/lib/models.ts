export enum TransitType {
  NONSTOP = 'NONSTOP',
  ONE_STOP = 'ONE_STOP',
  TWO_STOPS = 'TWO_STOPS',
  THREE_STOPS = 'THREE_STOPS',
}

export interface SearchFlightQuery {
  origin: string;
  destination: string;
  departureDate: Date;
}

export interface FlightOffer {
  id: string;
  airlineName: string;
  airlineImageUrl: string;
  flightCode: string;
  origin: string;
  destination: string;
  route: string;
  departureDate: Date;
  transitType: TransitType;
  transitDetails?: string;
  timeSlot: string;
  basePrice: number;
  finalPrice: number;
  availableSeats: number;
  baggageAllowance: string;
  facilities?: string[];
}
