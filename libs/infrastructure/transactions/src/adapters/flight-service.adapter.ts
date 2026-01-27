import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FinalizeBookingRequest,
  IFlightServicePort,
} from '@tiketq-be/transactions_domain';
import { lastValueFrom, throwError, timer } from 'rxjs';
import { concatMap, retryWhen, tap } from 'rxjs/operators';

@Injectable()
export class FlightServiceAdapter implements IFlightServicePort {
  private readonly logger = new Logger(FlightServiceAdapter.name);

  constructor(
    private httpService: HttpService,
    private config: ConfigService
  ) {}

  async finalizeBooking(request: FinalizeBookingRequest): Promise<void> {
    const url = `${this.config.get(
      'FLIGHT_SERVICE_URL'
    )}/internal/flights/finalize-booking`;
    const apiKey = this.config.get('INTERNAL_API_KEY');

    try {
      await lastValueFrom(
        this.httpService
          .post(url, request, {
            headers: {
              'Content-Type': 'application/json',
              'X-Internal-API-Key': apiKey,
              'X-Correlation-ID': this.getCorrelationId(),
            },
            timeout: 5000,
          })
          .pipe(
            retryWhen((errors) =>
              errors.pipe(
                tap((error) => {
                  this.logger.warn(
                    `Flight Service call failed: ${error.message}`
                  );
                }),
                concatMap((error, index) => {
                  // Retry 3 times with delays: 2s, 4s, 8s
                  if (index >= 3) {
                    return throwError(() => error);
                  }
                  const delays = [2000, 4000, 8000];
                  this.logger.log(
                    `Retry attempt ${index + 1}/${3} after ${delays[index]}ms`
                  );
                  return timer(delays[index]);
                })
              )
            )
          )
      );

      this.logger.log(
        `Flight Service notified successfully for booking ${request.bookingId}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to notify Flight Service after retries: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  }

  private getCorrelationId(): string {
    // Would get from AsyncLocalStorage (see Gajah Duduk tasks)
    return 'placeholder-id';
  }
}
