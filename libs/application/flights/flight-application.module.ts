import { Module } from '@nestjs/common';
import { FlightDomainModule } from '../../domain/flights/flight-domain.module';

@Module({
    imports: [FlightDomainModule],
    controllers: [],
    providers: [],
  })
  export class FlightApplicationModule{}
  