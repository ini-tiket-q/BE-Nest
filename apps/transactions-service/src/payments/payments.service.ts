import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/req/create-payment.dto';
import { IMidtransPaymentPort } from 'libs/domain/src/transaction/ports';

@Injectable()
export class PaymentsService {
  constructor(@Inject('IMidtransPaymentPort') private readonly midtransSnapAdapter: IMidtransPaymentPort) {}
  async createTransaction(order: CreatePaymentDto): Promise<{ token: string, redirect_url: string }> {
    const param = {
      transaction_details: {
        order_id: order.order_id,
        gross_amount: order.gross_amount
      }
    }
    const generate = await this.midtransSnapAdapter.generateSnapUrl(param)
    return generate
  }

}
