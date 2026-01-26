import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MidtransSignatureService } from '@tiketq-be/payment';
import { MidtransCallbackDto } from '../dto/payment-webhook.dto';
import { PaymentSignatureInvalidException } from '@tiketq-be/transactions_domain';

@Injectable()
export class ProcessPaymentCallbackUseCase {
  private readonly logger = new Logger(ProcessPaymentCallbackUseCase.name);
  constructor(
    private readonly midtransSignatureService: MidtransSignatureService
  ) {}

  async execute(dto: MidtransCallbackDto): Promise<{ message: string }> {
    this.logger.log(
      `Processing payment callback for order ID: ${dto.order_id}`
    );

    const isValid = this.midtransSignatureService.verifySignature(
      dto.order_id,
      dto.status_code,
      dto.gross_amount,
      dto.signature_key
    );

    if (!isValid) {
      this.logger.error(
        `Failed to verify signature_key order_id ${dto.order_id}`
      );
      throw new PaymentSignatureInvalidException(
        `Invalid signature key order_id ${dto.order_id}`
      );
    }

    return { message: 'this is works right!' };
  }
}
