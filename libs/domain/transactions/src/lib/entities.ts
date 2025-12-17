/**
 * Transaction Status Enum
 * Represents the possible states of a transaction
 */
export enum TransactionStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

/**
 * Customer Information Value Object
 * Contains customer details for a transaction
 */
export class CustomerInfo {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly phone?: string
    ) {}

    static create(name: string, email: string, phone?: string): CustomerInfo {
        if (!name || name.trim().length === 0) {
        throw new Error('Customer name is required');
        }
        if (!email || !email.includes('@')) {
        throw new Error('Valid customer email is required');
        }
        return new CustomerInfo(name.trim(), email.trim(), phone?.trim());
    }
}

/**
 * Transaction Entity
 * Core domain model representing a payment transaction
 */
export class Transaction {
    constructor(
        public readonly id: string,
        public readonly amount: number,
        public readonly status: TransactionStatus,
        public readonly bookingId: string,
        public readonly customerInfo: CustomerInfo,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    /**
     * Factory method to create a new transaction
     */
    static create(
        id: string,
        amount: number,
        bookingId: string,
        customerInfo: CustomerInfo
    ): Transaction {
        if (amount <= 0) {
        throw new Error('Transaction amount must be positive');
        }
        if (!bookingId || bookingId.trim().length === 0) {
        throw new Error('Booking ID is required');
        }

        const now = new Date();
        return new Transaction(
            id,
            amount,
            TransactionStatus.PENDING,
            bookingId.trim(),
            customerInfo,
            now,
            now
        );
    }

    /**
     * Mark transaction as paid
     */
    markAsPaid(): Transaction {
        if (this.status !== TransactionStatus.PENDING) {
        throw new Error('Only pending transactions can be marked as paid');
        }

        return new Transaction(
        this.id,
        this.amount,
        TransactionStatus.PAID,
        this.bookingId,
        this.customerInfo,
        this.createdAt,
        new Date()
        );
    }

    /**
     * Mark transaction as failed
     */
    markAsFailed(): Transaction {
        if (this.status === TransactionStatus.PAID) {
        throw new Error('Cannot mark paid transactions as failed');
        }

        return new Transaction(
        this.id,
        this.amount,
        TransactionStatus.FAILED,
        this.bookingId,
        this.customerInfo,
        this.createdAt,
        new Date()
        );
    }

    /**
     * Check if transaction is pending
     */
    isPending(): boolean {
        return this.status === TransactionStatus.PENDING;
    }

    /**
     * Check if transaction is paid
     */
    isPaid(): boolean {
        return this.status === TransactionStatus.PAID;
    }

    /**
     * Check if transaction is failed
     */
    isFailed(): boolean {
        return this.status === TransactionStatus.FAILED;
    }
}
