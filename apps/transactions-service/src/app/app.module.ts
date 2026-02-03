import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentServiceModule } from './payments/payment-service.module';
import { PaymentsModule } from '../payments/payments.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionsModule } from '@tiketq-be/transactions';
import { TransactionsServiceModule } from './transactions/transactions-service.module';
import { DatabaseModule } from '@tiketq-be/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    TransactionsModule,
    TransactionsServiceModule,
    PaymentServiceModule,
    PaymentsModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

