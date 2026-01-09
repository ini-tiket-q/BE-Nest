import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IssueTicketProcessor } from './processors/issue-ticket.processor';
import { FlightInternalController } from './controllers/flight-internal.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { mmbcHttpConfig } from './config/mmbc-http.config';
import { MmbcAuthInterceptor } from './interceptors/mmbc-auth.interceptor';
import { MmbcService } from './services/mmbc.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync(mmbcHttpConfig),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'flight-issuance',
    }),
  ],
  providers: [MmbcAuthInterceptor, IssueTicketProcessor, MmbcService],
  controllers: [FlightInternalController],
  exports: [MmbcService],
})
export class FlightInfrastructureModule {}
