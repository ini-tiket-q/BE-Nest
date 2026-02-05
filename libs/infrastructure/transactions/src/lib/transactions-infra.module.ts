import { Module } from '@nestjs/common';
import { FlightServiceAdapter } from '../adapters/flight-service.adapter';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'IFlightServicePort',
      useClass: FlightServiceAdapter,
    },
  ],
  exports: ['IFlightServicePort'],
})
export class TransactionsInfraModule {}
