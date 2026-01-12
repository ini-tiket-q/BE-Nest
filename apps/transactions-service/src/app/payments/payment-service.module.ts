import { Module } from '@nestjs/common';
import { PaymentWebhookController } from './payment-webhook.controller';
import { MidtransSignatureService } from 'libs/infrastructure/payment/src/security/midtrans-signature.service';

@Module({
  controllers: [PaymentWebhookController],
  providers: [MidtransSignatureService],
})
export class PaymentServiceModule {}
