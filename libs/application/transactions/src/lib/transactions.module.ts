import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/database';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { GetTransactionDetailUseCase } from './use-cases/get-transaction-detail.use-case';
import { GetTransactionsUseCase } from './use-cases/get-transactions.use-case';
import { PaymentModule } from '@tiketq-be/payment';
import { ProcessPaymentCallbackUseCase } from '../use-cases/process-payment-callback.use-case';
import { GetPaymentStatusUseCase } from '../use-cases/get-payment-status.use-case';
import { GetPaymentUrlUseCase } from '../use-cases/get-payment-url.use-case';
import { TransactionsInfraModule } from '@tiketq-be/transactions_infra';

@Module({
  imports: [DatabaseModule, PaymentModule, TransactionsInfraModule],
  controllers: [],
  providers: [
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    GetTransactionDetailUseCase,
    ProcessPaymentCallbackUseCase,
    GetPaymentStatusUseCase,
    GetPaymentUrlUseCase,
  ],
  exports: [
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    GetTransactionDetailUseCase,
    ProcessPaymentCallbackUseCase,
    GetPaymentStatusUseCase,
    GetPaymentUrlUseCase,
  ],
})
export class TransactionsModule {}
