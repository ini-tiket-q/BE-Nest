import { Inject, Injectable } from '@nestjs/common';
import {
  IMidtransPaymentPort,
  IPaymentRepositoryPort,
  PaymentAlreadyProcessedException,
  PaymentNotFoundException,
} from '@tiketq-be/transactions_domain';

@Injectable()
export class GetPaymentUrlUseCase {
  constructor(
    @Inject('IMidtransPaymentPort')
    private paymentGateway: IMidtransPaymentPort,
    @Inject('IPaymentRepositoryPort')
    private readonly paymentRepository: IPaymentRepositoryPort
  ) {}

  async execute(transactionId: string): Promise<string> {
    const payment = await this.paymentRepository.findById(transactionId);

    if (!payment) {
      throw new PaymentNotFoundException(transactionId);
    }

    if (payment.status !== 'PENDING') {
      throw new PaymentAlreadyProcessedException(payment.status);
    }

    // Call Midtrans to get payment URL
    const paymentUrl = await this.paymentGateway.generateSnapUrl({
      transaction_details: {
        order_id: payment.id,
        gross_amount: payment.amount,
      },
    });

    return paymentUrl.redirect_url;
  }
}
