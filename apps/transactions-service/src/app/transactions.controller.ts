import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import {
    CreateTransactionDto,
    CreateTransactionResponseDto,
    TransactionsDataDto,
    TransactionsMetaDto,
} from '@tiketq-be/transactions_domain';
import { CreateTransactionUseCase, GetTransactionsUseCase } from '@tiketq-be/transactions';
import { GetTransactionsQueryDto } from './dto/get-transaction-query.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase, private readonly getTransactionsUseCase: GetTransactionsUseCase) {}

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

    @Get()
    @ApiOperation({
        summary: 'Get transaction history',
        description: 'Retrieve paginated transaction history for a user with optional filters'
    })
    @ApiResponse({
        status: 200,
        description: 'Transactions retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: getSchemaPath(TransactionsDataDto) } },
                meta: { $ref: getSchemaPath(TransactionsMetaDto) }
            }
        }
    })
    async getTransactions(@Query() query: GetTransactionsQueryDto) {
        return this.getTransactionsUseCase.execute(query)
    }
}
