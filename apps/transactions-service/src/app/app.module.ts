import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from '@tiketq-be/transactions';

@Module({
  imports: [TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
