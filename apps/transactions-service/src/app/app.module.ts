import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsModule } from '@tiketq-be/application/transactions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionsModule,
  ],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }

