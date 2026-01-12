import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../../../../libs/infrastructure/payment/src/lib/payment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentServiceModule } from './payments/payment-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PaymentModule,
    PaymentServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
