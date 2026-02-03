import { IMidtransPaymentPort } from '@tiketq-be/transactions_domain';
import { CheckoutUseCase } from './generate-url-payment.use-case'
import { PaymentParams } from 'libs/domain/transactions/models';

describe('CheckoutUseCase', () => {
    let useCase: CheckoutUseCase;
    let midtransSnapAdapter: jest.Mocked<IMidtransPaymentPort>;

    const param = {
        order_id: '207c3475-bda3-4735-b7bb-f93b36e0a7d6',
        gross_amount: 1500000
    };

    beforeEach(() => {
        midtransSnapAdapter = {
            generateSnapUrl: jest.fn()
        };

        useCase = new CheckoutUseCase(midtransSnapAdapter)
    });

    test('generate snap url', async () => {
        const mockSnapResponse: string = 'https://midtrans.snap/2412-3132-123'
        midtransSnapAdapter.generateSnapUrl.mockResolvedValue(mockSnapResponse);

        const result = await useCase.execute(param.order_id, param.gross_amount);

        const paramMidtrans: PaymentParams = {
            transaction_details: {
                order_id: param.order_id,
                gross_amount: param.gross_amount
            }
        };

        expect(midtransSnapAdapter.generateSnapUrl).toHaveBeenCalledWith(paramMidtrans);

        expect(result).toEqual(mockSnapResponse)
    })
})