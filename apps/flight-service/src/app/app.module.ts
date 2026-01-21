import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightDomainModule } from '@tiketq-be/flights_domain'
import { FlightApplicationModule } from '@tiketq-be/flights'

@Module({
  imports: [FlightDomainModule, FlightApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
