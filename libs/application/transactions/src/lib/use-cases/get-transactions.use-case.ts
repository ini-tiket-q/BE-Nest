import { GetTransactionsResponseDto, ITransactionRepositoryPort, TransactionsDataDto } from "@tiketq-be/transactions_domain";
import { GetTransactionsQuery } from "./get-transactions.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetTransactionsUseCase {
    constructor(@Inject('ITransactionRepositoryPort') private readonly transactionRepository: ITransactionRepositoryPort) {}

    async execute(query: GetTransactionsQuery): Promise<GetTransactionsResponseDto> {
        const { userId, page, limit, startDate, endDate, status } = query;
        const [dataTransaction, total]: [TransactionsDataDto[], number] = await Promise.all([
            this.transactionRepository.findByUserId(query),
            this.transactionRepository.countByUserId({ userId, startDate, endDate, status })
        ])

        const totalPages = Math.ceil(total / limit);

        return { data: dataTransaction, meta: { page, limit, total, totalPages }}
    }
}