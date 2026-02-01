import { Module } from '@nestjs/common';
import { FlightDomainModule } from '../../domain/flights/flight-domain.module';
import { FlightVendorModule } from '@tiketq-be/flight-vendor';
import { GetBookingUseCase } from './src/use-cases/get-booking.use-case';
import { GetBookingDetailsUseCase } from './src/use-cases/get-booking-details.use-case';

@Module({
  imports: [FlightDomainModule, FlightVendorModule],
  controllers: [],
  providers: [GetBookingUseCase, GetBookingDetailsUseCase],
  exports: [GetBookingUseCase, GetBookingDetailsUseCase],
})
export class FlightApplicationModule {}
  