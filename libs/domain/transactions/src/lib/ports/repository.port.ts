import { TransactionsDataDto } from '../dto/transactions-data.dto';
import { Transaction, TransactionStatus } from '../transaction.entities';
import { FindOperator } from 'typeorm';

/**
 * Repository Port - defines contract for transaction persistence
 * This is a PORT in Hexagonal Architecture
 * Infrastructure layer will implement this interface (ADAPTER)
 */
export interface ITransactionRepositoryPort {
    /**
     * Save a transaction to the database
     * @param transaction - Transaction domain entity to save
     * @returns Saved transaction with database-generated fields
     */
    save(transaction: Transaction): Promise<Transaction>;

    /**
     * Find a transaction by its ID
     * @param id - Transaction UUID
     * @returns Transaction if found, null otherwise
     */
    findById(id: string): Promise<Transaction | null>;

    /**
     * Find transactions by booking ID
     * @param bookingId - Booking UUID
     * @returns Array of transactions for the booking
     */
    findByBookingId(bookingId: string): Promise<Transaction[]>;

    /**
     * Find transactions by customer email
     * @param email - Customer email address
     * @returns Array of transactions for the customer
     */
    findByCustomerEmail(email: string): Promise<Transaction[]>;

    findByUserId(query: TransactionsQuery): Promise<TransactionsDataDto[]>

    countByUserId(query: CountTransactionsQuery): Promise<number>
}

export interface TransactionsQuery {
    userId: string;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date
    status?: TransactionStatus
}

export interface CountTransactionsQuery {
    userId: string;
    startDate?: Date;
    endDate?: Date
    status?: TransactionStatus
}

export interface FilterQueryByUserId {
    userId: string;
    createdAt?: FindOperator<Date>;
    status?: TransactionStatus
}