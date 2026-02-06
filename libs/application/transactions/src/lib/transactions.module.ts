import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/database';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { GetTransactionDetailUseCase } from './use-cases/get-transaction-detail.use-case';
import { GetTransactionsUseCase } from './use-cases/get-transactions.use-case';
import { PaymentModule } from '@tiketq-be/payment'

@Module({
  imports: [DatabaseModule, PaymentModule],
  controllers: [],
  providers: [CreateTransactionUseCase, GetTransactionsUseCase, GetTransactionDetailUseCase],
  exports: [CreateTransactionUseCase, GetTransactionsUseCase, GetTransactionDetailUseCase],
})
export class TransactionsModule {}
