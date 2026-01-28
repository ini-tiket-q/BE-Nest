import { Inject, Injectable, Logger } from '@nestjs/common';
import { MidtransSignatureService } from '@tiketq-be/payment';
import {
  IPaymentRepositoryPort,
  Payment,
  PaymentSignatureInvalidException,
  PaymentStatus,
} from '@tiketq-be/transactions_domain';
import { MidtransCallbackDto } from '../dto/payment-webhook.dto';

@Injectable()
export class ProcessPaymentCallbackUseCase {
  private readonly logger = new Logger(ProcessPaymentCallbackUseCase.name);

  constructor(
    private readonly midtransSignatureService: MidtransSignatureService,
    @Inject('IPaymentRepositoryPort')
    private readonly paymentRepository: IPaymentRepositoryPort
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

    // Fetch existing payment from repository
    const existingPayment = await this.paymentRepository.findByOrderId(
      dto.order_id
    );

    if (!existingPayment) {
      this.logger.warn(
        `Payment not found for order_id ${dto.order_id}, creating new payment`
      );
    }

    // Create payment entity - use existing or create new
    const payment = new Payment(
      dto.order_id,
      (existingPayment?.status as PaymentStatus) || PaymentStatus.PENDING
    );

    this.logger.log(
      `Payment entity created: order_id=${payment.id}, initial_status=${payment.status}`
    );

    // Map Midtrans status code to payment status transition
    if (dto.status_code === '200') {
      payment.markAsPaid();
      this.logger.log(`Payment marked as PAID: order_id=${dto.order_id}`);
    } else if (dto.status_code === '201') {
      payment.markAsPending();
      this.logger.log(`Payment marked as PENDING: order_id=${dto.order_id}`);
    } else {
      payment.markAsFailed();
      this.logger.log(`Payment marked as FAILED: order_id=${dto.order_id}`);
    }

    // Save payment to database
    await this.paymentRepository.save(payment);

    this.logger.log(
      `Payment saved successfully: order_id=${dto.order_id}, status=${dto.transaction_status}`
    );

    return { message: 'Payment processed and saved successfully' };
  }
}
