import { Inject, Injectable } from '@nestjs/common';
import {
  ITransactionRepositoryPort,
  PaymentNotFoundException
} from '@tiketq-be/transactions_domain';
@Injectable()
export class GetPaymentStatusUseCase {
  constructor(
    @Inject('ITransactionRepositoryPort')
    private readonly transactionRepository: ITransactionRepositoryPort
  ) {}

  async execute(transactionId: string) {
    // const payment = await this.paymentRepository.findById(transactionId);
    const trx = await this.transactionRepository.findById(transactionId);
    if (!trx) {
      throw new PaymentNotFoundException(transactionId);
    }
    return {
      transactionId: trx.id,
      status: trx.status,
      amount: trx.amount,
      bookingId: trx.bookingId,
      createdAt: trx.createdAt,
      updatedAt: trx.updatedAt,
    };
  }
}
