import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IssueTicketProcessor } from './processors/issue-ticket.processor';
import { FlightInternalController } from './controllers/flight-internal.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MmbcAuthInterceptor } from './interceptors/mmbc-auth.interceptor';
import { MmbcService } from './services/mmbc.service';
import { ScheduleModule } from '@nestjs/schedule';

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
    ScheduleModule.forRoot(),
  ],
  providers: [
    MmbcAuthInterceptor,
    IssueTicketProcessor,
    MmbcService,
    RedisCacheService,
  ],
  controllers: [FlightInternalController],
  exports: [MmbcService, RedisCacheService],
})
export class FlightInfrastructureModule {}
