import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentModule } from '../../../../libs/infrastructure/payment/src/lib/payment.module';
import { PaymentServiceModule } from './payments/payment-service.module';
import { PaymentsModule } from '../payments/payments.module';
import { AppThrottlerModule } from '@tiketq-be/shared';

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
    PaymentsModule,
    AppThrottlerModule,
  ],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }

