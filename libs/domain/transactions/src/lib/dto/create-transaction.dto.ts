import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    ArrayNotEmpty,
} from 'class-validator';

/**
 * DTO for creating a new transaction
 */
export class CreateTransactionDto {
    @ApiProperty({
        description: 'UUID of the flight being booked',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    })
    @IsUUID('4')
    @IsNotEmpty()
    flightId!: string;

    @ApiProperty({
        description: 'Array of passenger UUIDs for this booking',
        example: [
            '550e8400-e29b-41d4-a716-446655440001',
            '550e8400-e29b-41d4-a716-446655440002',
        ],
        type: [String],
        minItems: 1,
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    passengerIds!: string[];

    @ApiProperty({
        description: 'Transaction amount (must be positive)',
        example: 1500000,
        minimum: 0.01,
    })
    @IsNumber()
    @IsPositive()
    amount!: number;

    @ApiProperty({
        description: 'Currency code (ISO 4217)',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    currency!: string;

    @ApiProperty({
        description: 'Customer full name',
        example: 'John Doe',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @ApiProperty({
        description: 'Customer email address',
        example: 'john.doe@example.com',
        required: true,
    })
    @IsEmail()
    customerEmail!: string;

    @ApiProperty({
        description: 'Customer phone number (optional)',
        example: '+6281234567890',
        required: false,
    })
    @IsOptional()
    @IsString()
    customerPhone?: string;
}
