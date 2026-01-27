export interface FlightServicePort {
  finalizeBooking(request: FinalizeBookingRequest): Promise<void>;
}

export interface FinalizeBookingRequest {
  bookingId: string;
  transactionId: string;
  status: 'PAID' | 'FAILED';
  timestamp: string;
}
