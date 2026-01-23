import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
  TransactionsDataDto,
  TransactionsMetaDto,
} from '@tiketq-be/transactions_domain';
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  GetTransactionDetailUseCase,
} from '@tiketq-be/transactions';
import { GetTransactionsQueryDto } from './dto/get-transaction-query.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly getTransactionDetailUseCase: GetTransactionDetailUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new transaction',
    description:
      'Creates a new flight booking transaction with the specified details.',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description:
      'Transaction creation payload. Customer fields are required for guest checkout.',
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
    description:
      'Retrieve paginated transaction history for a user with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(TransactionsDataDto) },
        },
        meta: { $ref: getSchemaPath(TransactionsMetaDto) },
      },
    },
  })
  async getTransactions(@Query() query: GetTransactionsQueryDto) {
    return this.getTransactionsUseCase.execute(query);
  }

  @Get(':transactionId')
  @ApiOperation({
    summary: 'Get transaction detail',
    description:
      'Retrieve detailed information about a specific transaction including booking details',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction detail retrieved',
    schema: {
      type: 'object',
      properties: {
        transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            amount: { type: 'number', example: 1500000 },
            currency: { type: 'string', example: 'IDR' },
            status: { type: 'string', example: 'PENDING' },
            bookingId: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            customerInfo: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                phone: { type: 'string', example: '+6281234567890' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiParam({
    name: 'transactionId',
    type: String,
    description: 'Transaction ID',
  })
  @ApiHeader({
    name: 'X-Correlation-ID',
    required: false,
    description: 'Request tracking ID',
  })
  async getTransactionDetail(@Param('transactionId') transactionId: string) {
    return this.getTransactionDetailUseCase.execute(transactionId);
  }
}
