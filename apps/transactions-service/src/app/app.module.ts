import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }

