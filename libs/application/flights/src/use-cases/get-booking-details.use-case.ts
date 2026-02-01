import { Inject, Injectable } from '@nestjs/common';
import {
  BookingWithDetails,
  BOOKING_VENDOR_PORT,
  IBookingVendorPort,
} from '@tiketq-be/flights_domain';
import { BookingNotFoundException } from '../exceptions/booking-not-found.exception';

@Injectable()
export class GetBookingDetailsUseCase {
  constructor(
    @Inject(BOOKING_VENDOR_PORT)
    private readonly bookingVendor: IBookingVendorPort
  ) {}

  async execute(bookingCode: string): Promise<BookingWithDetails> {
    const booking = await this.bookingVendor.getBookingStatusWithDetails(
      bookingCode
    );

    if (!booking) {
      throw new BookingNotFoundException(bookingCode);
    }

    return booking;
  }
}
