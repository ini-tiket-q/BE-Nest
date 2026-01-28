import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/req/create-payment.dto';
import { CheckoutUseCase } from '@tiketq-be/transactions';

@Injectable()
export class PaymentsService {
  constructor(private readonly checkout: CheckoutUseCase) {}
  async createTransaction(order: CreatePaymentDto): Promise<string> {
    const generate = await this.checkout.execute(order.order_id, order.gross_amount)
    return generate
  }
}
