import { Module } from '@nestjs/common';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TransactionsModule],
  controllers: [PaymentWebhookController, PaymentsController],
  providers: [],
})
export class PaymentServiceModule {}
