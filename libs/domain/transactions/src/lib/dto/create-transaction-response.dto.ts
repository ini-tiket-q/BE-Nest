import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../entities';

/**
 * Response DTO for transaction creation
 */
export class CreateTransactionResponseDto {
    @ApiProperty({
        description: 'UUID of the created transaction',
        example: '550e8400-e29b-41d4-a716-446655440099',
        format: 'uuid',
    })
    transactionId!: string;

    @ApiProperty({
        description: 'Current status of the transaction',
        enum: TransactionStatus,
        example: TransactionStatus.PENDING,
    })
    status!: TransactionStatus;

    @ApiProperty({
        description: 'Transaction amount',
        example: 1500000,
    })
    amount!: number;

    @ApiProperty({
        description: 'Currency code (ISO 4217)',
        example: 'IDR',
    })
    currency!: string;

    @ApiProperty({
        description: 'Transaction creation timestamp',
        example: '2026-01-03T08:00:00.000Z',
        format: 'date-time',
    })
    createdAt!: string;
}
