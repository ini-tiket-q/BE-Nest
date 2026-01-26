import { Module } from '@nestjs/common';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentWebhookController } from './payment-webhook.controller';

@Module({
  imports: [TransactionsModule],
  controllers: [PaymentWebhookController],
  providers: [],
})
export class PaymentServiceModule {}
