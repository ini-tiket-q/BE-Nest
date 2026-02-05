import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MmbcAuthInterceptor {
  constructor(private readonly configService: ConfigService) {}

  onRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const clientId = this.configService.get<string>('MMBC_CLIENT_ID');
    const secretKey = this.configService.get<string>('MMBC_SECRET_KEY');

    config.headers = {
      ...config.headers,
      'X-Client-Id': clientId,
      'X-Secret-Key': secretKey,
    };

    return config;
  }
}
