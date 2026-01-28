import { Module } from '@nestjs/common';
import { PaymentModule } from '@tiketq-be/payment';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TransactionsModule } from '@tiketq-be/transactions';

@Module({
  imports: [PaymentModule, TransactionsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
