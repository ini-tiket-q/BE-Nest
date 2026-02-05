import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { 
    Transaction, 
    CustomerInfo, 
    TransactionStatus,
    ITransactionRepositoryPort, 
    QueryByUserId,
    CountTransactionsQuery,
    FilterQuery,
    QueryByEmail
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
        model.userId = transaction.userId;
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
            saved.userId,
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
            model.userId,
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
            model.userId,
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

    async findByCustomerEmail(query: QueryByEmail): Promise<Transaction[]> {
        const skipData: number = (query.page - 1) * query.limit;
        // for filter query
        let filterQuery: FilterQuery = { customerEmail: query.email }
        if(query.status) filterQuery.status = query.status; 
        if(query.startDate && query.endDate) {
            filterQuery.createdAt = Between(query.startDate, query.endDate);
        } else if (query.startDate) {
            filterQuery.createdAt = MoreThanOrEqual(query.startDate);
        } else if (query.endDate) {
            filterQuery.createdAt = LessThanOrEqual(query.endDate);
        }

        const models = await this.repo.find({
            where: filterQuery,
            take: query.limit,
            skip: skipData,
            select: {
                id: true,
                currency: true,
                amount: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return models.map(model => new Transaction(
            model.id,
            model.userId,
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

    async findByUserId(query: QueryByUserId): Promise<Transaction[]> {
        const skipData: number = (query.page - 1) * query.limit;
        // for filter query
        let filterQuery: FilterQuery = { userId: query.userId }
        if(query.status) filterQuery.status = query.status; 
        if(query.startDate && query.endDate) {
            filterQuery.createdAt = Between(query.startDate, query.endDate);
        } else if (query.startDate) {
            filterQuery.createdAt = MoreThanOrEqual(query.startDate);
        } else if (query.endDate) {
            filterQuery.createdAt = LessThanOrEqual(query.endDate);
        }
        
        const models = await this.repo.find({
            where: filterQuery,
            take: query.limit,
            skip: skipData,
            select: {
                id: true,
                currency: true,
                amount: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return models.map(model => new Transaction(
            model.id,
            model.userId,
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

    async countByUserId(query: CountTransactionsQuery): Promise<number> {
        // for filter query
        let filterQuery: FilterQuery = {};
        if(query.userId) filterQuery.userId = query.userId;
        if(query.email) filterQuery.customerEmail = query.email
        if(query.status) filterQuery.status = query.status; 
        // for filter query createdAt
        if(query.startDate && query.endDate) {
            filterQuery.createdAt = Between(query.startDate, query.endDate);
        } else if (query.startDate) {
            filterQuery.createdAt = MoreThanOrEqual(query.startDate);
        } else if (query.endDate) {
            filterQuery.createdAt = LessThanOrEqual(query.endDate);
        }

        const countData: number = await this.repo.count({ 
            where: filterQuery
        })
        return countData
    }
}
