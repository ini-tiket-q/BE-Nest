import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MidtransCallbackDto } from './payment-webhook.dto';

@Controller('payments')
export class PaymentWebhookController {
  @Post('callbacks/midtrans')
  @HttpCode(HttpStatus.OK)
  midtransTransaction(@Body() dto: MidtransCallbackDto) {
    console.log(`payload:: ${JSON.stringify(dto)}`);
  }
}
