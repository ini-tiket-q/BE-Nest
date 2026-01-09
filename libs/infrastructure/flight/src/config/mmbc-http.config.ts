import { HttpModuleAsyncOptions } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MmbcAuthInterceptor } from '../interceptors/mmbc-auth.interceptor';

export const mmbcHttpConfig: HttpModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService, MmbcAuthInterceptor],
  useFactory: async (
    configService: ConfigService,
    authInterceptor: MmbcAuthInterceptor,
  ) => ({
    baseURL: configService.get<string>('MMBC_BASE_URL'),
    timeout: 10000,
    interceptors: {
      request: [authInterceptor],
    },
  }),
};
