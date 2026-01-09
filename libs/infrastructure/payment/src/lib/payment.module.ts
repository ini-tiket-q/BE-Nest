import { Module } from '@nestjs/common';
import { PaymentWebhookController } from '../controllers/payment-webhook.controller';
import { MidtransSignatureService } from '../security/midtrans-signature.service';

@Module({
  controllers: [PaymentWebhookController],
  providers: [MidtransSignatureService],
  exports: [],
})
export class PaymentModule {}
