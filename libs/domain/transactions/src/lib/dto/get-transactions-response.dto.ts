import { Type } from "class-transformer";
import { TransactionsDataDto } from "./transactions-data.dto";
import { TransactionsMetaDto } from "./transactions-meta.dto";

export class GetTransactionsResponseDto {
    // @Type(() => Object)
    data!: TransactionsDataDto[];
    // @Type(() => Object)
    meta!: TransactionsMetaDto;
}