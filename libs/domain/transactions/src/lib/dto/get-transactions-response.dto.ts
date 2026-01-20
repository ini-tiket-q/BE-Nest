import { TransactionsDataDto } from "./transactions-data.dto";
import { TransactionsMetaDto } from "./transactions-meta.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetTransactionsResponseDto {
    @ApiProperty({ type: () => TransactionsDataDto, isArray: true })
    data!: TransactionsDataDto[];
    @ApiProperty({ type: () => TransactionsMetaDto })
    meta!: TransactionsMetaDto;
}