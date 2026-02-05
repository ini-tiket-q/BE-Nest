import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/database';
import { PaymentModule } from '@tiketq-be/payment';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { ProcessPaymentCallbackUseCase } from '../use-cases/process-payment-callback.use-case';
import { TransactionsInfraModule } from '@tiketq-be/transactions_infra';
import { GetPaymentUrlUseCase } from '../use-cases/get-payment-url.use-case';
import { GetPaymentStatusUseCase } from '../use-cases/get-payment-status.use-case';

@Module({
  imports: [DatabaseModule, PaymentModule, TransactionsInfraModule],
  controllers: [],
  providers: [
    CreateTransactionUseCase,
    ProcessPaymentCallbackUseCase,
    GetPaymentUrlUseCase,
    GetPaymentStatusUseCase,
  ],
  exports: [
    CreateTransactionUseCase,
    ProcessPaymentCallbackUseCase,
    GetPaymentUrlUseCase,
    GetPaymentStatusUseCase,
  ],
})
export class TransactionsModule {}
