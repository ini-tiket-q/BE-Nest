import { Injectable, Logger } from "@nestjs/common";
import { FinalizeBookingDto } from "../dto/finalize-booking.dto";

@Injectable()
export class FinalizeBookingUseCase {
  private readonly logger = new Logger(FinalizeBookingUseCase.name);

  async execute(dto: FinalizeBookingDto) {
    this.logger.log(`Finalizing booking ${dto.bookingId} with status ${dto.status}`);

    if (dto.status === 'PAID') {
      // Start background ticket issuance
      this.processInBackground(dto.bookingId, dto.transactionId);
    }

    return {
      message: 'Booking finalization started',
      bookingId: dto.bookingId,
    };
  }

  private processInBackground(bookingId: string, transactionId: string) {
    setTimeout(async () => {
      try {
        this.logger.log(`Starting ticket issuance for ${bookingId}`);
        // TODO: Call MMBC issue ticket API
        this.logger.log(`Ticket issued for ${bookingId}`);
      } catch (error) {
        this.logger.error(`Ticket issuance failed for ${bookingId}`, error);
      }
    }, 0);
  }
}