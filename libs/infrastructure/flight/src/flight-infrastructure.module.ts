import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IssueTicketProcessor } from './jobs/issue-ticket.processor';
import { FlightInternalController } from './controllers/flight-internal.controller';

@Module({
    imports: [
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
    providers: [IssueTicketProcessor],
    controllers: [FlightInternalController],
})
export class FlightInfrastructureModule { }