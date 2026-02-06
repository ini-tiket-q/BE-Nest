import { Module } from '@nestjs/common';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentController } from './payment.controller';
import { MidtransSignatureService } from 'libs/infrastructure/payment/src/security/midtrans-signature.service';

@Module({
  imports: [TransactionsModule],
  controllers: [PaymentWebhookController, PaymentController],
  providers: [MidtransSignatureService],
})
export class PaymentServiceModule {}
