import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetPaymentStatusUseCase,
  GetPaymentUrlUseCase,
} from '@tiketq-be/transactions';

@Controller('payments')
@ApiTags('payments')
export class PaymentController {
  constructor(
    private readonly getPaymentUrlUseCase: GetPaymentUrlUseCase,
    private readonly getPaymentStatusUseCase: GetPaymentStatusUseCase
  ) {}

  @Get(':transactionId/payment-url')
  @ApiOperation({
    summary: 'Get Midtrans payment URL',
    description:
      'Returns the Midtrans Snap URL for the user to complete payment',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiParam({ name: 'transactionId', type: String })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getPaymentUrl(@Param('transactionId') transactionId: string) {
    const paymentUrl = await this.getPaymentUrlUseCase.execute(transactionId);
    return { paymentUrl };
  }

  @Get(':transactionId/status')
  @ApiOperation({
    summary: 'Get transaction status',
    description: 'Check payment status for a specific transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        transactionId: { type: 'string' },
        status: { type: 'string' },
        amount: { type: 'number' },
        bookingId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Payment already processed' })
  @ApiParam({ name: 'transactionId', type: String })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    const status = await this.getPaymentStatusUseCase.execute(transactionId);
    return status;
  }
}
