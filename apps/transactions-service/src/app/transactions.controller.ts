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
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new transaction',
        description: 'Creates a new flight booking transaction with the specified details.',
    })
    @ApiBody({
        type: CreateTransactionDto,
        description: 'Transaction creation payload. Customer fields are required for guest checkout.',
        examples: {
            guestCheckout: {
                summary: 'Guest checkout (with customer info)',
                description: 'Used when user is not authenticated',
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
            authenticatedUser: {
                summary: 'Authenticated user (without customer info)',
                description: 'Customer info will be extracted from JWT token',
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
    async createTransaction(
        @Body() createTransactionDto: CreateTransactionDto
    ): Promise<CreateTransactionResponseDto> {
        return await this.createTransactionUseCase.execute(createTransactionDto);
    }
}
