import { TransactionStatus } from "@tiketq-be/transactions_domain";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class GetTransactionsQueryDto {
    @IsString()
    userId: string;
    @Type(() => Number)
    @IsNumber()
    page: number;
    @Type(() => Number)
    @IsNumber()
    limit: number;
    @IsString()
    @IsOptional()
    startDate?: Date;
    @IsString()
    @IsOptional()
    endDate?: Date
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus
}