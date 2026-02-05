import { Module } from '@nestjs/common';
import { BookingController } from 'apps/flight-service/src/bookings/booking.controller';
import { CancelBookingUseCase } from 'libs/application/flights/src/use-cases/cancel-booking.use-case';


@Module({
  controllers: [ BookingController ],
  providers: [ CancelBookingUseCase ],
  exports: [ CancelBookingUseCase ],
})
export class FlightsModule {}
