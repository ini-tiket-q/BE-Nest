import { HttpService } from '@nestjs/axios';
import { MidtransSnapAdapter } from './midtrans-snap.adapter'
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { MidtransResponseDto, PaymentParams } from 'libs/domain/transactions/models';
import { defer, of, throwError } from 'rxjs';
import { MidtransErrorResponse } from '../exception/midtrans-http-error';
import { HttpResilienceConfig } from '../config/http-resilience.config';

describe('MidtransSnapAdapter', () => {
    let midtransAdapter: MidtransSnapAdapter;
    let httpService: jest.Mocked<HttpService>;

    const paramMidtrans: PaymentParams = {
        transaction_details: {
            order_id: '207c3475-bda3-4735-b7bb-f93b36e0a7d6',
            gross_amount: 1500000
        }
    };

    const mockResUrl: string = 'https://midtrans.snap/2412-3132-123';
    const mockResHttp: AxiosResponse<MidtransResponseDto> = {
        data: { token: '1231231', redirect_url: mockResUrl },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() }
    };

    const mockAxiosResponse: AxiosResponse<MidtransErrorResponse> = {
        data: {
            status_code: '500',
            status_message: 'Midtrans internal server error',
            error_messages: ['Something went wrong on Midtrans server'],
        },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
    };

    const mockAxiosError: AxiosError<MidtransErrorResponse> = {
        name: 'AxiosError',
        message: 'Midtrans internal server error',
        isAxiosError: true,
        config: { headers: new AxiosHeaders() },
        request: {},
        response: mockAxiosResponse,
        code: 'ERR_BAD_RESPONSE',
        toJSON: () => ({}),
    };

    beforeEach( async () => {
        HttpResilienceConfig.retry.maxAttempts = 3;
        mockAxiosResponse.data.status_code = '500';
        mockAxiosResponse.status = 500;
        mockAxiosResponse.data.status_message = 'Midtrans internal server error';
        mockAxiosError.message = 'Midtrans internal server error';
        process.env['SERVER_KEY'] = 'dummy-server-key';
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MidtransSnapAdapter,
                { provide: HttpService, useValue: { post: jest.fn() } },
            ],
        }).compile();
        midtransAdapter = module.get(MidtransSnapAdapter);
        httpService = module.get(HttpService);
    });

    test('test return generateUrl Midtrans for process payment', async () => {
        httpService.post.mockReturnValue(of(mockResHttp))

        const result = await midtransAdapter.generateSnapUrl(paramMidtrans)

        expect(result).toEqual(mockResHttp.data.redirect_url);
    });

    test('test throw error 500 Midtrans internal server error', async() => {
        HttpResilienceConfig.retry.maxAttempts = 0;

        httpService.post.mockReturnValue(throwError(() => mockAxiosError));

        const result = midtransAdapter.generateSnapUrl(paramMidtrans);

        await expect(result).rejects.toThrow(/Midtrans internal server error/)
    });

    test('test throw error 404 Midtrans endpoint not found', async() => {
        mockAxiosResponse.data.status_code = '404';
        mockAxiosResponse.status = 404;
        mockAxiosResponse.data.status_message = 'Midtrans endpoint not found';
        mockAxiosError.message = 'Midtrans endpoint not found'
        httpService.post.mockReturnValue(throwError(() => mockAxiosError));

        const result = midtransAdapter.generateSnapUrl(paramMidtrans);

        await expect(result).rejects.toThrow(/Midtrans endpoint not found/)
    });

    test('test retry request exactly 3 times', async() => {
        // make fake time, for not waiting real timeout
        // jest.useFakeTimers()
        let retryCount = 0;

        jest.spyOn(httpService, 'post').mockReturnValue(defer(() => {
            retryCount++;
            return throwError(() => mockAxiosError)
        }));

        const result = midtransAdapter.generateSnapUrl(paramMidtrans);
        //  skip time
        // jest.runAllTimers();
        await expect(result).rejects.toThrow(/Midtrans internal server error/);
        expect(retryCount).toBe(4)
        // back to real timer, for next test
        // jest.useRealTimers()
    }, 10000);
})