import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { MidtransSignatureService } from '../../../../../libs/infrastructure/payment/src/security/midtrans-signature.service';
import { MidtransCallbackDto } from './dto/payment-webhook.dto';

@Controller('payments')
export class PaymentWebhookController {
  constructor(
    private readonly midtransSignatureService: MidtransSignatureService
  ) {}
  @Post('callbacks/midtrans')
  @HttpCode(HttpStatus.OK)
  async midtransTransaction(@Body() dto: MidtransCallbackDto) {
    console.log(`payload:: ${JSON.stringify(dto)}`);

    const isVerified = await this.midtransSignatureService.verifySignature(
      dto.order_id,
      dto.status_code,
      dto.gross_amount,
      dto.signature_key
    );

    if (!isVerified) {
      throw new InternalServerErrorException();
    }

    const statusMap: Record<string, string> = {
      settlement: 'PAID',
      capture: 'PAID',
      expire: 'EXPIRED',
      pending: 'PENDING',
    };

    const status = statusMap[dto.transaction_status] ?? 'FAILED';

    console.log(
      `transaction status | orderId=${dto.order_id} | status=${status}`
    );

    return { message: 'OK' };
  }
}
