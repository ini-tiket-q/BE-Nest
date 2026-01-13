import { Module } from '@nestjs/common';
import { DatabaseModule } from '@tiketq-be/infrastructure/database';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [CreateTransactionUseCase],
  exports: [CreateTransactionUseCase],
})
export class TransactionsModule {}
