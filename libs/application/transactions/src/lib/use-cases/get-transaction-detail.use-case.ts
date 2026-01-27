import { Injectable } from '@nestjs/common';
import { ITransactionRepositoryPort } from '@tiketq-be/transactions_domain';
import { TransactionNotFoundException } from '../../exception/transaction-not-found-exception';

@Injectable()
export class GetTransactionDetailUseCase {
  constructor(private TransactionRepository: ITransactionRepositoryPort) {}

  async execute(transactionId: string) {
    const transaction = await this.TransactionRepository.findById(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundException(transactionId);
    }

    return {
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        bookingId: transaction.bookingId,
        customerInfo: {
          name: transaction.customerInfo.name,
          email: transaction.customerInfo.email,
          phone: transaction.customerInfo.phone,
        },
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    };
  }
}
