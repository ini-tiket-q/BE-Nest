import { Transaction } from './entities';

export interface ITransactionRepositoryPort {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
}