import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentWebhookController {
  @Post('callbacks/midtrans')
  @HttpCode(HttpStatus.OK)
  midtransTransaction() {}
}
