import { Module } from '@nestjs/common';
import { MidtransSignatureService } from '../security/midtrans-signature.service';

@Module({
  controllers: [],
  providers: [MidtransSignatureService],
  exports: [MidtransSignatureService],
})
export class PaymentModule {}
