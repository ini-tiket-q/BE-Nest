import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MidtransSnapAdapter } from '../adapters/midtrans-snap.adapter';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [{ provide: 'IMidtransPaymentPort', useClass: MidtransSnapAdapter }],
  exports: ['IMidtransPaymentPort'],
})
export class PaymentModule {}
