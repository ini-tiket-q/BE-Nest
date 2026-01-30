import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Transaction,
  CustomerInfo,
  ITransactionRepositoryPort,
  CreateTransactionDto,
  CreateTransactionResponseDto,
} from '@tiketq-be/transactions_domain';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepositoryPort')
    private readonly transactionRepository: ITransactionRepositoryPort
  ) {}

  async execute(
    dto: CreateTransactionDto
  ): Promise<CreateTransactionResponseDto> {
    // Generate transaction ID
    const transactionId = uuidv4();

    // Create customer info from required DTO fields
    const customerInfo = CustomerInfo.create(
      dto.customerName,
      dto.customerEmail,
      dto.customerPhone
    );

    // Create transaction domain entity
    const transaction = Transaction.create(
      transactionId,
      dto.amount,
      dto.currency,
      dto.flightId,
      customerInfo
    );

    // Save to database via repository
    const savedTransaction = await this.transactionRepository.save(transaction);

    // Return response DTO
    return {
      transactionId: savedTransaction.id,
      status: savedTransaction.status,
      amount: savedTransaction.amount,
      currency: savedTransaction.currency,
      createdAt: savedTransaction.createdAt.toISOString(),
    };
  }
}
