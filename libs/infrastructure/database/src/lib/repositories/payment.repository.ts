import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaymentRepositoryPort,
  Payment,
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
}
