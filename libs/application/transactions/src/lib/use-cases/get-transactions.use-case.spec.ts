import { GetTransactionsUseCase } from './get-transactions.use-case';
import { ITransactionRepositoryPort, TransactionsDataDto } from '@tiketq-be/transactions_domain';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;
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

    useCase = new GetTransactionsUseCase(transactionRepository);
  });

  it('should return transactions with correct pagination meta', async () => {
    // arrange
    const mockTransactions: TransactionsDataDto[] = [
      { id: 'trx-1' } as TransactionsDataDto,
      { id: 'trx-2' } as TransactionsDataDto,
    ];

    transactionRepository.findByUserId.mockResolvedValue(mockTransactions);
    transactionRepository.countByUserId.mockResolvedValue(12);

    const query = {
      userId: 'user-1',
      page: 1,
      limit: 5,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    };

    // act
    const result = await useCase.execute(query);

    // assert
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
        total: 12,
        totalPages: 3,
      },
    });
  });

  it('should return totalPages = 0 when total is 0', async () => {
    transactionRepository.findByUserId.mockResolvedValue([]);
    transactionRepository.countByUserId.mockResolvedValue(0);

    const result = await useCase.execute({
      userId: 'user-1',
      page: 1,
      limit: 10,
    });

    expect(result.meta.totalPages).toBe(0);
  });
});