import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('flight-issuance')
export class IssueticketProcessor extends WorkerHost {
    async process(job: Job<{ bookingId: string}>): Promise<void> {
        const {bookingId} = job.data;

        console.log(`Processing Ticket Issue for ID: ${bookingId}`);
        
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(`Ticket Issued Successfully for ID: ${bookingId}`);
        } catch (error) {
            console.error(`Ticket Issuance failed for ID: ${bookingId}`, error,);
            throw error;
        }
    }
}