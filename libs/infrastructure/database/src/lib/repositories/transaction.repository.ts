import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
    Transaction, 
    CustomerInfo, 
    TransactionStatus,
    ITransactionRepositoryPort 
} from '@tiketq-be/transactions_domain';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class TransactionRepository implements ITransactionRepositoryPort {
    constructor(
        @InjectRepository(TransactionModel)
        private readonly repo: Repository<TransactionModel>,
    ) {}

    async save(transaction: Transaction): Promise<Transaction> {
        // Map: Domain Entity → Database Model
        const model = new TransactionModel();
        model.id = transaction.id;
        model.amount = transaction.amount;
        model.currency = transaction.currency;
        model.status = transaction.status;
        model.bookingId = transaction.bookingId;
        model.customerName = transaction.customerInfo.name;
        model.customerEmail = transaction.customerInfo.email;
        model.customerPhone = transaction.customerInfo.phone || null;
        
        // Save to database
        const saved = await this.repo.save(model);
        
        // Map: Database Model → Domain Entity
        return new Transaction(
            saved.id,
            saved.amount,
            saved.currency,
            saved.status as TransactionStatus,
            saved.bookingId,
            new CustomerInfo(
                saved.customerName,
                saved.customerEmail,
                saved.customerPhone || undefined
            ),
            saved.createdAt,
            saved.updatedAt
        );
    }

    async findById(id: string): Promise<Transaction | null> {
        const model = await this.repo.findOne({ where: { id } });
        if (!model) return null;
        
        // Map: Database Model → Domain Entity
        return new Transaction(
            model.id,
            model.amount,
            model.currency,
            model.status as TransactionStatus,
            model.bookingId,
            new CustomerInfo(
                model.customerName,
                model.customerEmail,
                model.customerPhone || undefined
            ),
            model.createdAt,
            model.updatedAt
        );
    }

    async findByBookingId(bookingId: string): Promise<Transaction[]> {
        const models = await this.repo.find({ where: { bookingId } });
        return models.map(model => new Transaction(
            model.id,
            model.amount,
            model.currency,
            model.status as TransactionStatus,
            model.bookingId,
            new CustomerInfo(
                model.customerName,
                model.customerEmail,
                model.customerPhone || undefined
            ),
            model.createdAt,
            model.updatedAt
        ));
    }

    async findByCustomerEmail(email: string): Promise<Transaction[]> {
        const models = await this.repo.find({ where: { customerEmail: email } });
        return models.map(model => new Transaction(
            model.id,
            model.amount,
            model.currency,
            model.status as TransactionStatus,
            model.bookingId,
            new CustomerInfo(
                model.customerName,
                model.customerEmail,
                model.customerPhone || undefined
            ),
            model.createdAt,
            model.updatedAt
        ));
    }
}
