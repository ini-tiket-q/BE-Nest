import { Logger, BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import {
  lastValueFrom,
  catchError,
  throwError,
  timeout,
  retry,
  timer,
} from 'rxjs';
import { handleMidtransError } from '../../../errors-mapping/midtrans-error.mapper';
import { MidtransErrorResponse, MidtransHttpError } from '../../../exception/midtrans-http-error';
import { HttpResilienceConfig } from '../../../config/http-resilience.config';

@Injectable()
export class MidtransClient {
  private readonly logger = new Logger(MidtransClient.name);
  private readonly serverKey = process.env['SERVER_KEY'];

  constructor(private readonly httpService: HttpService) {
    if (!this.serverKey)
      throw new BadRequestException('SERVER_KEY is undefined');
  }

  async reqMidtrans<T, U>(path: string, params: U): Promise<T> {
    const encodedServerKey = Buffer.from(`${this.serverKey}:`, 'utf8').toString(
      'base64'
    );

    this.logger.log(`Sending request to Midtrans: ${path}`);

    const response = await lastValueFrom(
      this.httpService
        .post<T>(path, params, {
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
    return response.data;
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
