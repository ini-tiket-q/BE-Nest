import { Module } from '@nestjs/common';
import { FlightServiceAdapter } from '../adapters/flight-service.adapter';

@Module({
  providers: [
    {
      provide: 'IFlightServicePort',
      useClass: FlightServiceAdapter,
    },
  ],
  exports: ['IFlightServicePort'],
})
export class TransactionsInfraModule {}
