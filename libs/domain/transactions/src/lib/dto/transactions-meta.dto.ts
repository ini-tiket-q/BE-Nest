import { Type } from "class-transformer";

export class TransactionsMetaDto {
    @Type(() => Number)
    page!: number;

    @Type(() => Number)
    limit!: number;

    @Type(() => Number)
    total!: number;

    @Type(() => Number)
    totalPages!: number;

}