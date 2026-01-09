import { Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentWebhookController {
  @Post('callbacks/midtrans')
  midtransTransaction(): string {
    return 'payment ok';
  }
}
