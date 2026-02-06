import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FinalizeBookingRequest } from '../dto/finalize-booking-request.dto';

@Controller('internal/flights')
export class FlightInternalController {
    constructor(
        @InjectQueue('flight-issuance')
        private readonly flightIssuanceQueue: Queue,
    ) {}

    @Post('finalize-booking')
    @HttpCode(HttpStatus.ACCEPTED)
    async finalizeBooking(
        @Headers('x-internal-secret') internalSecret: string,
        @Body() body: FinalizeBookingRequest,
    ) {
        if (internalSecret !== process.env.INTERNAL_API_SECRET) {
            throw new UnauthorizedException('Invalid internal secret');
        }

        await this.flightIssuanceQueue.add('issue-ticket', {
            bookingId: body.bookingId,
            transactionId: body.transactionId,
        });

        return {
            status: 'accepted',
            message: 'Ticket issuance queued',
        };
    }
}