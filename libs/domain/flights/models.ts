export interface SearchFlightQuery {
    departureDate: Date;
    origin: string;
    destination: string;
    adults: number;
    children: number;
    infants: number;
}

export interface FlightOffer {
    airlineCode: string;
    airlineName: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    durationMinutes: number;
    price: number;
    currency: 'IDR';
    availableSeats: number;
    baggageAllowance: number;
}