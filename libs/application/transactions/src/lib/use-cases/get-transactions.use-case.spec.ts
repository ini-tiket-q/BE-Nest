import { GetTransactionsUseCase } from './get-transactions.use-case';
import { ITransactionRepositoryPort, TransactionsDataDto, TransactionStatus } from '@tiketq-be/transactions_domain';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepositoryPort>;

  const query = {
    userId: 'user-1',
    page: 1,
    limit: 5,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
  };

  beforeEach(() => {
    transactionRepository = {
      findByUserId: jest.fn(),
      countByUserId: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByBookingId: jest.fn(),
      findByCustomerEmail: jest.fn()
    };

    useCase = new GetTransactionsUseCase(transactionRepository);
  });

  test('return transactions with correct pagination meta', async () => {
    const mockTransactions: TransactionsDataDto[] = [
      { 
        id: 'trx-1',
        userId: 'user-1',
        currency: 'IDR',
        amount: 1500000,
        status: TransactionStatus.PAID,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'trx-2',
        userId: 'user-1',
        currency: 'IDR',
        amount: 2500000,
        status: TransactionStatus.PAID,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    transactionRepository.findByUserId.mockResolvedValue(mockTransactions)
    transactionRepository.countByUserId.mockResolvedValue(2);

    const result = await useCase.execute(query);


    expect(transactionRepository.findByUserId).toHaveBeenCalledWith(query);
    expect(transactionRepository.countByUserId).toHaveBeenCalledWith({
      userId: 'user-1',
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });

    expect(result).toEqual({
      data: mockTransactions,
      meta: {
        page: 1,
        limit: 5,
        total: 2,
        totalPages: 1,
      },
    });
  });

  test('return empty array transactions with totalPages = 0 when total is 0', async () => {
    transactionRepository.findByUserId.mockResolvedValue([]);
    transactionRepository.countByUserId.mockResolvedValue(0);

    const result = await useCase.execute(query);

    expect(transactionRepository.findByUserId).toHaveBeenCalledWith(query);
    expect(transactionRepository.countByUserId).toHaveBeenCalledWith({
      userId: 'user-1',
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });

    expect(result).toEqual({
      data: [],
      meta: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
      },
    });

  });
});