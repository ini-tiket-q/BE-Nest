import { Module } from '@nestjs/common';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentController } from './payment.controller';

@Module({
  imports: [TransactionsModule],
  controllers: [PaymentWebhookController, PaymentController],
  providers: [],
})
export class PaymentServiceModule {}
