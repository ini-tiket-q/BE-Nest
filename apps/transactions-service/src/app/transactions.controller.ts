import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    CreateTransactionDto,
    CreateTransactionResponseDto,
    TransactionStatus,
} from '@tiketq-be/transactions_domain';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new transaction',
        description: 'Creates a new flight booking transaction with the specified details.',
    })
    @ApiBody({
        type: CreateTransactionDto,
        description: 'Transaction creation payload',
        examples: {
            example1: {
                summary: 'Single passenger booking',
                value: {
                    flightId: '550e8400-e29b-41d4-a716-446655440000',
                    passengerIds: ['550e8400-e29b-41d4-a716-446655440001'],
                    amount: 1500000,
                    currency: 'IDR',
                },
            },
            example2: {
                summary: 'Multiple passengers booking',
                value: {
                    flightId: '550e8400-e29b-41d4-a716-446655440000',
                    passengerIds: [
                        '550e8400-e29b-41d4-a716-446655440001',
                        '550e8400-e29b-41d4-a716-446655440002',
                    ],
                    amount: 3000000,
                    currency: 'IDR',
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Transaction created successfully',
        type: CreateTransactionResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    createTransaction(
        @Body() createTransactionDto: CreateTransactionDto
    ): CreateTransactionResponseDto {
        // Mock response for API contract demonstration
        const response = new CreateTransactionResponseDto();
        response.transactionId = '550e8400-e29b-41d4-a716-446655440099';
        response.status = TransactionStatus.PENDING;
        response.amount = createTransactionDto.amount;
        response.currency = createTransactionDto.currency;
        response.createdAt = new Date().toISOString();
        return response;
    }
}
