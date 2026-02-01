import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { MmbcBookingResponseDto } from '../dtos/mmbc-booking-response.dto';

@Injectable()
export class MmbcService {
  private readonly baseUrl = 'http://klikmbc.co.id/json';
  private readonly logger = new Logger(MmbcService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getBookingStatus(bookingCode: string): Promise<MmbcBookingResponseDto> {
    const url = `${this.baseUrl}/getstatusbooking-json`;
    const payload = {
      username: this.configService.get<string>('MMBC_USERNAME'),
      password: this.configService.get<string>('MMBC_PASSWORD'),
      kodebooking: bookingCode,
    };

    this.logger.debug(`Fetching booking status for: ${bookingCode}`);

    const response = await firstValueFrom(
      this.httpService.post<MmbcBookingResponseDto>(url, payload).pipe(
        timeout(10000),
        catchError((error) => {
          this.logger.error(`MMBC API error: ${error.message}`);
          throw new HttpException(
            'MMBC service unavailable',
            HttpStatus.SERVICE_UNAVAILABLE
          );
        })
      )
    );

    this.logger.debug(`Booking status response: ${response.data.result}`);

    return response.data;
  }
}
