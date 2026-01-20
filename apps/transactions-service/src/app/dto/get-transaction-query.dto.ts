import { TransactionStatus } from "@tiketq-be/transactions_domain";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";

export class GetTransactionsQueryDto {
    @IsString()
    userId: string;
    @IsNumber()
    page: number;
    @IsNumber()
    limit: number;
    @IsString()
    startDate?: Date;
    @IsString()
    endDate?: Date
    @IsEnum(TransactionStatus)
    status?: TransactionStatus
}