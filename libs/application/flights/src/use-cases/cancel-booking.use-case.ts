import {Injectable, NotFoundException, BadRequestException,} from '@nestjs/common';
import { ITransactionRepositoryPort } from 'libs/domain/transactions/src/lib/ports/repository.port';
import { Transaction } from 'libs/domain/transactions/src/lib/transaction.entities';
  
  @Injectable()
  export class CancelBookingUseCase {
    constructor(
      private readonly transactionRepository: ITransactionRepositoryPort,
    ) {}
  
    async execute(bookingId: string) {
      const transactions =
        await this.transactionRepository.findByBookingId(bookingId);
  
      if (!transactions || transactions.length === 0) {
        throw new NotFoundException(`Booking ${bookingId} not found`);
      }
  
      // Assume the first / latest transaction represents the booking
      const transaction = transactions[0] as Transaction;
  
      let cancelledTransaction;
      try {
        cancelledTransaction = transaction.cancel();
      } catch (error) {
        if (error instanceof Error) {
            throw new BadRequestException(error.message);
        }

        throw new BadRequestException('Invalid booking cancellation request');
      }
  
      await this.transactionRepository.save(cancelledTransaction);
  
      return {
        bookingId,
        status: cancelledTransaction.status,
      };
    }
  }
  