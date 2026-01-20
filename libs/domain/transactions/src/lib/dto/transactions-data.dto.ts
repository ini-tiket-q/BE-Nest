import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionStatus } from "../transaction.entities";
import { Type } from "class-transformer"

export class TransactionsDataDto {
    @Type(() => String)
    id!: string;
    
    // @Type(() => String)
    // userId?: string;

    @Type(() => String)
    currency!: string

    @Type(() => Number)
    amount!: number

    @Type(() => String)
    status!: TransactionStatus

    @Type(() => String)
    createdAt!: Date;

    @Type(() => String)
    updatedAt!: Date
}