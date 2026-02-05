import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FlightResponseMapper } from '../mappers/flight-response.mapper'; 
import { FlightRoute } from '../../../../domain/flights/src/lib/flight-route.interface';

@Injectable()
export class MmbcService {
  constructor(private readonly httpService: HttpService) {}

  async searchFlights(payload: any): Promise<FlightRoute[]> {
    const response = await firstValueFrom(
      this.httpService.post('/search', payload),
    );

    const rawData = response.data;
    
if (!rawData || !Array.isArray(rawData)) {
      console.warn('⚠️ Data kosong/Error. Pakai Dummy Data untuk Task 2.');
      
      const dummyData = [
        {
          flight: 'Garuda Indonesia',
          flight_image: 'https://bit.ly/garuda-logo',
          flight_code: 'GA-404',
          flight_price: '1500000',
          flight_datetime: '10:00 12:00',
          flight_date: payload.date || '2026-06-01',
          flight_transit: '1 Transit'
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return dummyData.map((item: any) => FlightResponseMapper.toDomain(item));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((item: any) => FlightResponseMapper.toDomain(item));
  }
}