import { Inject, Injectable } from '@nestjs/common';
import {
  Booking,
  BOOKING_VENDOR_PORT,
  IBookingVendorPort,
} from '@tiketq-be/flights_domain';
import { BookingNotFoundException } from '../exceptions/booking-not-found.exception';

@Injectable()
export class GetBookingUseCase {
  constructor(
    @Inject(BOOKING_VENDOR_PORT)
    private readonly bookingVendor: IBookingVendorPort
  ) {}

  async execute(bookingCode: string): Promise<Booking> {
    const booking = await this.bookingVendor.getBookingStatus(bookingCode);

    if (!booking) {
      throw new BookingNotFoundException(bookingCode);
    }

    return booking;
  }
}
