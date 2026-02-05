import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MidtransCallbackDto, ProcessPaymentCallbackUseCase } from '@tiketq-be/transactions';

@ApiTags('Payments')
@Controller('payments')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    private readonly processPaymentCallbackUseCase: ProcessPaymentCallbackUseCase
  ) {}

  @Post('callbacks/midtrans')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Midtrans Payment Webhook',
    description:
      'Receives payment status updates from Midtrans. Verifies signature and updates payment status in database.',
  })
  @ApiBody({
    description: 'Midtrans callback payload',
    type: MidtransCallbackDto,
    examples: {
      qrisPayment: {
        summary: 'QRIS Payment Callback - Success',
        description:
          'Payment webhook callback from Midtrans for QRIS transaction with valid signature (returns 200)',
        value: {
          status_code: '201',
          transaction_id: 'bb0862e4-8d23-4f60-b32b-94607ba694d4',
          gross_amount: '10000.00',
          currency: 'IDR',
          order_id: '16822037-9202-41a1-b968-5d56d9bb2dd71',
          payment_type: 'qris',
          signature_key:
            'fb379287073580fe9e66de59a775ba8641c3540f22fb8c31ebf22b4aeeb9425bb8d5d007eadc9706324ca805abe8f7116d78797fa8d30ea551b3a82a8e70b052',
          transaction_status: 'pending',
          fraud_status: 'accept',
          status_message: 'Success, transaction is found',
          merchant_id: 'G861112747',
          transaction_time: '2026-01-09 19:46:04',
          expiry_time: '2026-01-09 20:01:04',
        },
      },
      invalidSignature: {
        summary: 'QRIS Payment Callback - Invalid Signature',
        description:
          'Payment webhook callback with invalid signature key (returns 401)',
        value: {
          status_code: '201',
          transaction_id: 'bb0862e4-8d23-4f60-b32b-94607ba694d4',
          gross_amount: '10000.00',
          currency: 'IDR',
          order_id: '16822037-9202-41a1-b968-5d56d9bb2dd71',
          payment_type: 'qris',
          signature_key: 'invalid_signature_key_12345',
          transaction_status: 'pending',
          fraud_status: 'accept',
          status_message: 'Success, transaction is found',
          merchant_id: 'G861112747',
          transaction_time: '2026-01-09 19:46:04',
          expiry_time: '2026-01-09 20:01:04',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OK' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Midtrans signature',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid Midtrans signature' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async midtransTransaction(
    @Body() dto: MidtransCallbackDto
  ): Promise<{ message: string }> {
    // Log incoming webhook
    this.logger.log(`Webhook received:: ${JSON.stringify(dto)}`);

    return await this.processPaymentCallbackUseCase.execute(dto);
  }
}
