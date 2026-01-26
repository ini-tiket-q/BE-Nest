import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MidtransSignatureService } from '@tiketq-be/payment';
import { MidtransCallbackDto } from '../dto/payment-webhook.dto';

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
      throw new NotFoundException('failed to verify signature_key!');
    }

    return { message: 'this is works right!' };
  }
}
