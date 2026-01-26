import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MidtransSignatureService } from '@tiketq-be/payment';

@Injectable()
export class ProcessPaymentCallbackUseCase {
  private readonly logger = new Logger(ProcessPaymentCallbackUseCase.name);
  constructor(
    private readonly midtransSignatureService: MidtransSignatureService
  ) {}

  async execute(callbackPayload: any): Promise<{ message: string }> {
    this.logger.log(
      `Processing payment callback for order ID: ${callbackPayload.order_id}`
    );

    const isValid = this.midtransSignatureService.verifySignature(
      callbackPayload.order_id,
      callbackPayload.status_code,
      callbackPayload.gross_amount,
      callbackPayload.signature_key
    );

    if (!isValid) {
      this.logger.error(
        `Failed to verify signature_key order_id ${callbackPayload.order_id}`
      );
      throw new NotFoundException('failed to verify signature_key!');
    }

    return { message: 'this is works right!' };
  }
}
