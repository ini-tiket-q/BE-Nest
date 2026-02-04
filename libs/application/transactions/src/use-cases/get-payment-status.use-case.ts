import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentRepositoryPort,
  PaymentNotFoundException,
} from '@tiketq-be/transactions_domain';
@Injectable()
export class GetPaymentStatusUseCase {
  constructor(
    @Inject('IPaymentRepositoryPort')
    private readonly paymentRepository: IPaymentRepositoryPort
  ) {}

  async execute(transactionId: string) {
    const payment = await this.paymentRepository.findById(transactionId);
    if (!payment) {
      throw new PaymentNotFoundException(transactionId);
    }
    return {
      transactionId: payment.id,
      status: payment.status,
      amount: payment.amount,
      bookingId: payment.bookingId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
