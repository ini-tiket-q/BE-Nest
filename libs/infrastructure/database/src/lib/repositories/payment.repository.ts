import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaymentRepositoryPort,
  Payment,
  PaymentIdStatusDto,
} from '@tiketq-be/transactions_domain';
import { Repository } from 'typeorm';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class PaymentRepository implements IPaymentRepositoryPort {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly repo: Repository<TransactionModel>
  ) {}

  async save(payment: Payment): Promise<void> {
    // Update only the status column
    await this.repo.update({ id: payment.id }, { status: payment.status });
  }

  async findByOrderId(orderId: string): Promise<PaymentIdStatusDto | null> {
    const payment = await this.repo.findOne({
      where: { id: orderId },
      select: ['id', 'status'],
    });
    return payment || null;
  }
}
