import { Booking, BookingWithDetails } from '../models/booking.model';

export interface IBookingVendorPort {
  getBookingStatus(bookingCode: string): Promise<Booking | null>;
  getBookingStatusWithDetails(bookingCode: string): Promise<BookingWithDetails | null>;
}

export const BOOKING_VENDOR_PORT = Symbol('BookingVendorPort');
