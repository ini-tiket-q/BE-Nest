import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MidtransSnapAdapter } from '../adapters/midtrans-snap.adapter';
import { MidtransClient } from './transactions/clients/midtrans.client';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [{ provide: 'IMidtransPaymentPort', useClass: MidtransSnapAdapter }, MidtransClient],
  exports: ['IMidtransPaymentPort'],
})
export class PaymentModule {}
