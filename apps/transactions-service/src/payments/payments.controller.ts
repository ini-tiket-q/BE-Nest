import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/req/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-transaction')
  async transaction(@Body() order: CreatePaymentDto): Promise<{ token: string, redirect_url: string }> {
    const transaction = await this.paymentsService.createTransaction(order)
    return transaction;
  }
}
