import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MidtransCallbackDto } from './payment-webhook.dto';
import { verifySignature } from '../security/midtrans-signature.service';

@Controller('payments')
export class PaymentWebhookController {
  @Post('callbacks/midtrans')
  midtransNotification(@Body() dto: MidtransCallbackDto, @Res() res: Response) {
    console.log(`payload:: ${JSON.stringify(dto)}`);

    const isVerified = verifySignature(
      dto.signature_key,
      dto.order_id,
      dto.status_code,
      dto.gross_amount
    );

    if (isVerified) {
      console.log('success verify signature key');
    } else {
      console.error('failed to verify signature key');
    }

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Notification received',
    });
  }
}
