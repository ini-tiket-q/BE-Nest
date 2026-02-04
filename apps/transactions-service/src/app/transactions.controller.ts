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
} from '@tiketq-be/transactions_domain';
import { CreateTransactionUseCase } from '@tiketq-be/transactions';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new transaction',
        description: 'Creates a new flight booking transaction with the specified details.',
    })
    @ApiBody({
        type: CreateTransactionDto,
        description: 'Transaction creation payload. Customer name and email are required.',
        examples: {
            createTransaction: {
                summary: 'Create transaction with customer information',
                description: 'Customer name and email are required fields',
                value: {
                    flightId: '550e8400-e29b-41d4-a716-446655440000',
                    passengerIds: ['550e8400-e29b-41d4-a716-446655440001'],
                    amount: 1500000,
                    currency: 'IDR',
                    customerName: 'John Doe',
                    customerEmail: 'john.doe@example.com',
                    customerPhone: '+6281234567890',
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
    async createTransaction(
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<CreateTransactionResponseDto> {
        return await this.createTransactionUseCase.execute(createTransactionDto);
    }
}
