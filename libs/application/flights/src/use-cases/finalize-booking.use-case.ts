import { Injectable, Logger } from '@nestjs/common';
import { from, lastValueFrom, timer } from 'rxjs';
import { retry, tap } from 'rxjs/operators';

@Injectable()
export class FinalizeBookingUseCase {
  private readonly logger = new Logger(FinalizeBookingUseCase.name);

  constructor(
    private readonly mmbcAdapter: any,
  ) {}

  async execute(bookingId: string): Promise<void> {
    this.processInBackground(bookingId);
  }

  private processInBackground(bookingId: string) {
    setTimeout(async () => {
      try {
        await this.issueTicketWithRetry(bookingId);
        this.logger.log(`Ticket successfully issued for ${bookingId}`);
      } catch (error) {
        this.logger.error(
          `All ticket issuance attempts failed for ${bookingId}`,
          error,
        );
      }
    }, 0);
  }

  private async issueTicketWithRetry(bookingId: string): Promise<void> {
    await lastValueFrom(
      from(this.mmbcAdapter.issueTicket(bookingId)).pipe(
        retry({
          count: 3,
          delay: (error, retryCount) => {
            const delays = [2000, 4000, 8000];

            this.logger.warn(`MMBC call failed: ${error.message}`);
            this.logger.log(
              `Retry attempt ${retryCount}/3 after ${delays[retryCount - 1]}ms`,
            );

            return timer(delays[retryCount - 1]);
          },
        }),
        tap(() => {
          this.logger.log(`MMBC issue ticket success`);
        }),
      ),
    );
  }
}
