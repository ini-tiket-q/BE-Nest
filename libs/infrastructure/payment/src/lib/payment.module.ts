import { Module } from '@nestjs/common';
import { MidtransSnapAdapter } from '../adapters/midtrans-snap.adapter';
import { MidtransClient } from './transactions/clients/midtrans.client';

@Module({
  controllers: [],
  providers: [{ provide: 'IMidtransPaymentPort', useClass: MidtransSnapAdapter }, MidtransClient],
  exports: ['IMidtransPaymentPort'],
})
export class PaymentModule {}
