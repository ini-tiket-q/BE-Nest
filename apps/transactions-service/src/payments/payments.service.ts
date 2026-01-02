import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/req/create-payment.dto';

@Injectable()
export class PaymentsService {

  async createTransaction(order: CreatePaymentDto): Promise<string | number> {
    return order.order_id + 'nice';
  }

}
