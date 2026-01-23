import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/database';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { GetTransactionDetailUseCase } from './use-cases/get-transaction-detail.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [CreateTransactionUseCase, GetTransactionDetailUseCase],
  exports: [CreateTransactionUseCase, GetTransactionDetailUseCase],
})
export class TransactionsModule {}
