import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MmbcService {
  constructor(private readonly httpService: HttpService) {}

  async searchFlights(payload: any) {
    const response = await firstValueFrom(
      this.httpService.post('/search', payload),
    );

    return response.data;
  }
}
