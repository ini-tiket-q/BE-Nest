import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BOOKING_VENDOR_PORT } from '@tiketq-be/flights_domain';
import { MmbcService } from './services/mmbc.service';
import { MmbcBookingAdapter } from './adapters/mmbc-booking.adapter';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    MmbcService,
    MmbcBookingAdapter,
    {
      provide: BOOKING_VENDOR_PORT,
      useClass: MmbcBookingAdapter,
    },
  ],
  exports: [BOOKING_VENDOR_PORT],
})
export class FlightVendorModule {}
