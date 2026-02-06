import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisCacheService } from './redis-cache.service';
import { AirportRepositoryPort } from '@libs/domain/flights';

@Injectable()
export class AirportCacheService {
  private readonly logger = new Logger(AirportCacheService.name);
  private readonly CACHE_KEY = 'airports:all';
  private readonly CACHE_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

  constructor(
    private redisCache: RedisCacheService,
    private airportRepository: AirportRepositoryPort,
  ) {}

  async getAllAirports(): Promise<any[]> {
    // Try to get from cache first
    const cached = await this.redisCache.get<any[]>(this.CACHE_KEY);
    if (cached) {
      this.logger.log(`Returning ${cached.length} airports from cache`);
      return cached;
    }

    // Cache miss - fetch from database
    this.logger.log('Cache miss - fetching airports from database');
    const airports = await this.airportRepository.findAll();

    // Save to cache for 30 days
    await this.redisCache.set(this.CACHE_KEY, airports, this.CACHE_TTL);
    this.logger.log(`Cached ${airports.length} airports for ${this.CACHE_TTL}s (30 days)`);

    return airports;
  }

  async invalidate(): Promise<void> {
    await this.redisCache.del(this.CACHE_KEY);
    this.logger.log('Airport cache invalidated');
  }

  // Optional: Warm up cache on application startup
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async warmUpCache(): Promise<void> {
    this.logger.log('Warming up airport cache...');
    await this.getAllAirports(); // This will fetch and cache
  }
}