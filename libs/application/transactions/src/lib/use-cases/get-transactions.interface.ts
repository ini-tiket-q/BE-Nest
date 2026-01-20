import { TransactionStatus } from "@tiketq-be/transactions_domain";

export interface GetTransactionsQuery {
    userId: string;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date
    status?: TransactionStatus
}