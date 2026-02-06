import { ITransactionRepositoryPort, Transaction, TransactionStatus } from '@tiketq-be/transactions_domain';
import { GetTransactionDetailUseCase } from './get-transaction-detail.use-case'
import { TransactionNotFoundException } from '../../exception/transaction-not-found-exception';

describe('GetTransactionDetailUseCase', () => {
    let useCase: GetTransactionDetailUseCase;
    let transactionRepository: jest.Mocked<ITransactionRepositoryPort>;

    beforeEach(() => {
        transactionRepository = {
            findByUserId: jest.fn(),
            countByUserId: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findByBookingId: jest.fn(),
            findByCustomerEmail: jest.fn()
        };

        useCase = new GetTransactionDetailUseCase(transactionRepository);
    });

    test('return transaction detail', async() => {
        const mockDetailTransaction: Transaction = {   
            id: "ef46c43a-a3dc-4433-9d56-44ea9bb0fffe",
            userId: 'user-1',
            amount: 1500000.00,
            currency: "IDR",
            status: TransactionStatus.CREATED,
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            customerInfo: {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "+6281234567890"
            },
            createdAt: new Date(),
            updatedAt: new Date(),

            initiatePayment: jest.fn(),
            markAsPaid: jest.fn(),
            markAsFailed: jest.fn(),
            isPending: jest.fn().mockReturnValue(true),
        } as unknown as Transaction;

        transactionRepository.findById.mockResolvedValue(mockDetailTransaction)

        const result = await useCase.execute("ef46c43a-a3dc-4433-9d56-44ea9bb0fffe")

        expect(result).toEqual({
            transaction: {
                id: mockDetailTransaction.id,
                amount: mockDetailTransaction.amount,
                currency: mockDetailTransaction.currency,
                status: mockDetailTransaction.status,
                bookingId: mockDetailTransaction.bookingId,
                customerInfo: {
                name: mockDetailTransaction.customerInfo.name,
                email: mockDetailTransaction.customerInfo.email,
                phone: mockDetailTransaction.customerInfo.phone,
                },
                createdAt: mockDetailTransaction.createdAt,
                updatedAt: mockDetailTransaction.updatedAt,
            },
        });
    });

    test('testing throw error transaction not found', async() => {
        transactionRepository.findById.mockResolvedValue(null)

        const result = useCase.execute("ef46c43a-a3dc-4433-9d56-44ea9bb0asdas");

        await expect(result).rejects.toThrow(new TransactionNotFoundException("ef46c43a-a3dc-4433-9d56-44ea9bb0asdas"))
    })
})