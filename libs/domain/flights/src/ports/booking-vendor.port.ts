import { Booking } from '../models/booking.model';

export interface IBookingVendorPort {
  getBookingStatus(bookingCode: string): Promise<Booking | null>;
}

export const BOOKING_VENDOR_PORT = Symbol('BookingVendorPort');
