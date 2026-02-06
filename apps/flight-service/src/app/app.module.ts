import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightDomainModule } from '@tiketq-be/flights_domain';
import { FlightApplicationModule } from '@tiketq-be/flights';
import { AppThrottlerModule } from '@tiketq-be/shared';
import { BookingController } from '../bookings/booking.controller';

@Module({
  imports: [FlightDomainModule, FlightApplicationModule, AppThrottlerModule],
  controllers: [AppController, BookingController],
  providers: [AppService],
})
export class AppModule {}
