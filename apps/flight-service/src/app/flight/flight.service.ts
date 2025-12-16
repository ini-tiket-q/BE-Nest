import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);
  
  // URL API Bosbiller (Ini contoh, nanti sesuaikan kalau ada info dari tim)
  private readonly bosbillerBaseUrl = 'https://api.bosbiller-staging.com/v1';
  private readonly apiKey = process.env.BOSBILLER_API_KEY || 'dummy-key';

  constructor(private readonly httpService: HttpService) {}

  // TASK 1: Adapter/Wrapper Service
  async searchFlights(params: any) {
    this.logger.log(`Searching flights with params: ${JSON.stringify(params)}`);

    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      params: {
        // Mapping parameter: Kiri (Bosbiller) = Kanan (Input dari Frontend/Internal)
        origin: params.departureCode,      
        destination: params.arrivalCode,   
        date: params.departureDate,        
        passengers: params.passengerCount
      }
    };

    try {
      // Nembak API Bosbiller
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.bosbillerBaseUrl}/search`, requestConfig).pipe(
          catchError((error: AxiosError) => {
            this.logger.error('Error from Bosbiller API', error.response?.data);
            throw 'Vendor Error'; 
          }),
        ),
      );

      // Panggil Task 2
      return this.normalizeBosbillerResponse(data);

    } catch (error) {
      this.logger.error('Failed to search flights', error);
      throw error;
    }
  }

  // TASK 2: Normalisasi Data
  private normalizeBosbillerResponse(vendorData: any): any[] {
    const flights = vendorData.results || [];

    return flights.map((flight: any) => ({
      // KIRI: Format Internal TicketQ
      // KANAN: Format dari Bosbiller (Vendor)
      airline: flight.maskapai_name,         
      flightNumber: flight.nomor_penerbangan, 
      departureAirport: flight.asal,          
      arrivalAirport: flight.tujuan,          
      departureTime: flight.jam_pergi,        
      arrivalTime: flight.jam_tiba,
      price: Number(flight.harga_tiket),      
      currency: 'IDR',
      duration: flight.durasi_menit || 0,
    }));
  }
}