import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { MidtransResponseDto, PaymentParams } from "../../../../domain/transactions/models";
import { IMidtransPaymentPort } from "@tiketq-be/transactions_domain";
import { lastValueFrom, catchError, throwError, timeout, retry, timer } from 'rxjs';
import { HttpService } from "@nestjs/axios";
import { HttpResilienceConfig } from "../config/http-resilience.config";
import { AxiosError } from "axios";
import { MidtransErrorResponse, MidtransHttpError } from "../exception/midtrans-http-error";
import { handleMidtransError } from "../errors-mapping/midtrans-error.mapper";

@Injectable()
export class MidtransSnapAdapter implements IMidtransPaymentPort {
    private readonly logger = new Logger(MidtransSnapAdapter.name);
    private readonly serverKey = process.env['SERVER_KEY'];

    constructor(private readonly httpService: HttpService) {
        if (!this.serverKey) throw new BadRequestException('SERVER_KEY is undefined');
    }

    async generateSnapUrl (params: PaymentParams): Promise<string> {
        const transaction: PaymentParams = params
        const path = `https://app.sandbox.midtrans.com/snap/v1/transactions`
        const generate: string = await this.createTransaction(path, transaction);
        return generate
    }

    private async createTransaction(path: string, params: PaymentParams): Promise<string> {
        const encodedServerKey = Buffer.from(`${this.serverKey}:`, 'utf8').toString(
            'base64'
        );

        this.logger.log(`Sending request to Midtrans: ${path}`);

        const response: { status: number, statusText: string, data: MidtransResponseDto } = await lastValueFrom(
            this.httpService
            .post<MidtransResponseDto>(path, params, {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${encodedServerKey}`,
                },
            })
            .pipe(
                timeout(HttpResilienceConfig.timeout),
                retry({
                count: HttpResilienceConfig.retry.maxAttempts,
                delay: (
                    error: AxiosError<MidtransErrorResponse>,
                    retryCount: number
                ) => {
                    const status = error.response?.status;
                    if (!this.isRetryableError(status)) {
                    this.logger.error(`Non-retryable error: ${status}. No retry.`);
                    return throwError(() => error);
                    }
                    const delayMs = this.calculateBackoffDelay(retryCount);
                    this.logger.warn(
                    `Retry attempt ${retryCount}/${HttpResilienceConfig.retry.maxAttempts}. ` +
                        `Waiting ${delayMs}ms. Status: ${status || 'TIMEOUT'}`
                    );
                    return timer(delayMs);
                },
                }),
                catchError((error: AxiosError<MidtransErrorResponse>) => {
                const status = error.response?.status || 0;
                const data = error.response?.data;
                const message = data?.error_messages?.join(', ') || error.message;
                this.logger.error(
                    `All retry attempts exhausted. Status: ${status}`
                );
                const midtransError = new MidtransHttpError(status, data, message);
                handleMidtransError(midtransError);
                return throwError(() => error);
                })
            )
        );
        this.logger.log('Midtrans request successful');
        return response.data.redirect_url;
    }
    private isRetryableError(status: number | undefined): boolean {
        if (!status) return true;
        if (HttpResilienceConfig.nonRetryableStatusCodes.includes(status)) {
            return false;
        }
        if (HttpResilienceConfig.retryableStatusCodes.includes(status)) {
            return true;
        }
        return status >= 500;
    }
    private calculateBackoffDelay(retryCount: number): number {
        const { initialDelay, maxDelay, exponentialBackoff } =
        HttpResilienceConfig.retry;
        if (!exponentialBackoff) {
            return initialDelay;
        }
        const exponentialDelay = initialDelay * Math.pow(2, retryCount - 1);
        return Math.min(exponentialDelay, maxDelay);
    }
}