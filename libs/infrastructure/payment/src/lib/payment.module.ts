import { Module } from '@nestjs/common';
import { PaymentWebhookController } from '../controllers/payment-webhook.controller';

@Module({
  controllers: [PaymentWebhookController],
  providers: [],
  exports: [],
})
export class PaymentModule {}
