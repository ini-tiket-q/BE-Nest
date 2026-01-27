import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/req/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { GetPaymentUrlUseCase } from '@tiketq-be/transactions';

@Controller('payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService, private readonly getPaymentUrlUseCase: GetPaymentUrlUseCase) {}
  @Post('create-transaction')
  async transaction(@Body() order: CreatePaymentDto): Promise<{ token: string, redirect_url: string }> {
    const transaction = await this.paymentsService.createTransaction(order)
    return transaction;
  }

 @Get(':transactionId/payment-url')
  @ApiOperation({
    summary: 'Get Midtrans payment URL',
    description: 'Returns the Midtrans Snap URL for the user to complete payment'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Payment already processed' })
  @ApiParam({ name: 'transactionId', type: String })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getPaymentUrl(@Param('transactionId') transactionId: string) {
    const paymentUrl = await this.getPaymentUrlUseCase.execute(transactionId);
    return { paymentUrl };
  }
}
