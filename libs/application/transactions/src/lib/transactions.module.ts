import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/database';
import { PaymentModule } from '@tiketq-be/payment';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { ProcessPaymentCallbackUseCase } from './use-cases/process-payment-callback.use-case';

@Module({
  imports: [DatabaseModule, PaymentModule],
  controllers: [],
  providers: [CreateTransactionUseCase, ProcessPaymentCallbackUseCase],
  exports: [CreateTransactionUseCase, ProcessPaymentCallbackUseCase],
})
export class TransactionsModule {}
