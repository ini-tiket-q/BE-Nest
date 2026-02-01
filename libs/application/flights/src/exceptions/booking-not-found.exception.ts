import { NotFoundException } from '@nestjs/common';

export class BookingNotFoundException extends NotFoundException {
  constructor(bookingCode: string) {
    super(`Booking with code '${bookingCode}' not found`);
  }
}
