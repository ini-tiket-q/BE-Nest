import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MidtransCallbackDto } from './payment-webhook.dto';
import { verifySignature } from '../security/midtrans-signature.service';

@Controller('payments')
export class PaymentWebhookController {
  @Post('callbacks/midtrans')
  @HttpCode(HttpStatus.OK)
  midtransTransaction(@Body() dto: MidtransCallbackDto) {
    console.log(`payload:: ${JSON.stringify(dto)}`);

    const isVerified = verifySignature(
      dto.order_id,
      dto.status_code,
      dto.gross_amount,
      dto.signature_key
    );

    if (isVerified) {
      console.log('success verify signature');
    } else {
      console.log('failed to verify signature');
    }
  }
}
