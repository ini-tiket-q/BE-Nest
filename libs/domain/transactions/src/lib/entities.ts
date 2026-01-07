export enum TransactionStatus {
    CREATED = 'CREATED',
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

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

export class Transaction {
    constructor(
        public readonly id: string,
        public readonly amount: number,
        public readonly currency: string,
        public readonly status: TransactionStatus,
        public readonly bookingId: string,
        public readonly customerInfo: CustomerInfo,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    static create(
        id: string,
        amount: number,
        currency: string,
        bookingId: string,
        customerInfo: CustomerInfo
    ): Transaction {
        if (amount <= 0) {
            throw new Error('Transaction amount must be positive');
        }
        if (!bookingId || bookingId.trim().length === 0) {
            throw new Error('Booking ID is required');
        }
        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency is required');
        }

        const now = new Date();
        return new Transaction(
            id,
            amount,
            currency.toUpperCase().trim(),
            TransactionStatus.CREATED,
            bookingId.trim(),
            customerInfo,
            now,
            now
        );
    }

    initiatePayment(): Transaction {
        if (this.status !== TransactionStatus.CREATED) {
            throw new Error('Only created transactions can be initiated for payment');
        }

        return new Transaction(
            this.id,
            this.amount,
            this.currency,
            TransactionStatus.PENDING,
            this.bookingId,
            this.customerInfo,
            this.createdAt,
            new Date()
        );
    }

    markAsPaid(): Transaction {
        if (this.status !== TransactionStatus.PENDING) {
            throw new Error('Only pending transactions can be marked as paid');
        }

        return new Transaction(
            this.id,
            this.amount,
            this.currency,
            TransactionStatus.PAID,
            this.bookingId,
            this.customerInfo,
            this.createdAt,
            new Date()
        );
    }

    markAsFailed(): Transaction {
        if (this.status === TransactionStatus.PAID) {
            throw new Error('Cannot mark paid transactions as failed');
        }

        return new Transaction(
            this.id,
            this.amount,
            this.currency,
            TransactionStatus.FAILED,
            this.bookingId,
            this.customerInfo,
            this.createdAt,
            new Date()
        );
    }

    isPending(): boolean {
        return this.status === TransactionStatus.PENDING;
    }

    isCreated(): boolean {
        return this.status === TransactionStatus.CREATED;
    }

    isPaid(): boolean {
        return this.status === TransactionStatus.PAID;
    }

    isFailed(): boolean {
        return this.status === TransactionStatus.FAILED;
    }
}
