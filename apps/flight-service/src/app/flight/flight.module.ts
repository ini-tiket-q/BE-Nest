import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightService } from './flight.service';

@Module({
  imports: [HttpModule], 
  controllers: [],
  providers: [FlightService],
  exports: [FlightService], // Kita export supaya bisa dipakai module lain
})
export class FlightModule {}