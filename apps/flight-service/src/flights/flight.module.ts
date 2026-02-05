import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          db: config.get('REDIS_DB', 0),
        }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class FlightServiceModule {}

function redisStore(arg0: { host: any; port: any; db: any; }): unknown {
    throw new Error('Function not implemented.');
}
