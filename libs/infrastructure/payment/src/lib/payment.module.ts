import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MidtransSnapAdapter } from '../adapters/midtrans-snap.adapter';
import { MidtransSignatureService } from '../security/midtrans-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    { provide: 'IMidtransPaymentPort', useClass: MidtransSnapAdapter },
    MidtransSignatureService,
  ],
  exports: ['IMidtransPaymentPort', MidtransSignatureService],
})
export class PaymentModule {}
