import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions-service.controller';
import { TransactionsModule } from '@tiketq-be/transactions';
import { DatabaseModule } from '@tiketq-be/database';

@Module({
  imports: [TransactionsModule, DatabaseModule],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsServiceModule {}
