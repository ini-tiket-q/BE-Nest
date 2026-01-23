import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentModule } from '../../../../libs/infrastructure/payment/src/lib/payment.module';
import { PaymentServiceModule } from './payments/payment-service.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionsServiceModule } from './transactions/transactions-service.module';
import { DatabaseModule } from '@tiketq-be/database';
import { AppThrottlerModule } from '@tiketq-be/shared';

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
    DatabaseModule
    PaymentModule,
    AppThrottlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

