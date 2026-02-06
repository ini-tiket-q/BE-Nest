import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from '@tiketq-be/transactions';
import { PaymentModule } from '@tiketq-be/payment';
import { AppThrottlerModule } from '@tiketq-be/shared';
import { PaymentServiceModule } from './payments/payment-service.module';
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
    DatabaseModule,
    PaymentModule,
    PaymentServiceModule,
    AppThrottlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

