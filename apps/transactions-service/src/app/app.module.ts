import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../../../../libs/infrastructure/payment/src/lib/payment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentServiceModule } from './payments/payment-service.module';
import { PaymentsModule } from '../payments/payments.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionsController } from './transactions.controller';
import { TransactionsModule } from '@tiketq-be/transactions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    TransactionsModule,
    PaymentModule,
    PaymentServiceModule,
    PaymentsModule
  ],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }

