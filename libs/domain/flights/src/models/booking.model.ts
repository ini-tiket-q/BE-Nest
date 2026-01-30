export interface BookingPassenger {
  title: string;
  fullName: string;
  type: 'Adult' | 'Child' | 'Infant';
  baggageIntl?: string;
  ffNumber?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpired?: string;
}

export interface BookingContact {
  title: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface BookingPricing {
  currency: string;
  publishFare: number;
  tax: number;
  totalFare: number;
  realNta: number;
  shownNta: number;
  agentBonus: number;
}

export interface BookingFlightInfo {
  airline: string;
  flightCode: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  flightTime: string;
  transitInfo: string;
  transitDetails: string;
  flightClass: string;
}

export type BookingStatus = 'WAITING' | 'CANCEL' | 'EXPIRED' | 'ISSUED';

export interface Booking {
  bookingCode: string;
  transactionId: string;
  bookingDate: string;
  status: BookingStatus;
  totalPassengers: number;
  passengers: BookingPassenger[];
  contact: BookingContact;
  pricing: BookingPricing;
  timeLimit: string;
  bookedBy: string;
  bookedByAgentCode: string;
  issuedDate?: string;
  ticketNumber?: string;
  issuedBy?: string;
  issuedByAgentCode?: string;
}

export interface BookingWithDetails extends Booking {
  flight: BookingFlightInfo;
}
