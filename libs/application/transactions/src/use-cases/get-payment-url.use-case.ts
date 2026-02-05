import { Inject, Injectable } from '@nestjs/common';
import {
  IMidtransPaymentPort,
  ITransactionRepositoryPort,
  PaymentAlreadyProcessedException,
  PaymentNotFoundException
} from '@tiketq-be/transactions_domain';

@Injectable()
export class GetPaymentUrlUseCase {
  constructor(
    @Inject('IMidtransPaymentPort')
    private paymentGateway: IMidtransPaymentPort,
    @Inject('ITransactionRepositoryPort')
    private readonly transactionRepository: ITransactionRepositoryPort
  ) {}

  async execute(transactionId: string): Promise<string> {
    const trx = await this.transactionRepository.findById(transactionId);

    if (!trx) {
      throw new PaymentNotFoundException(transactionId);
    }

    if (trx.status !== 'PENDING') {
      throw new PaymentAlreadyProcessedException(trx.status);
    }

    // Call Midtrans to get payment URL
    const paymentUrl = await this.paymentGateway.generateSnapUrl({
      transaction_details: {
        order_id: trx.id,
        gross_amount: trx.amount,
      },
    });

    return paymentUrl;
  }
}
