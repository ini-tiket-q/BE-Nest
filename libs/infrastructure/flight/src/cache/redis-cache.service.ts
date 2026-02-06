import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    if (value) {
      this.logger.debug(`Cache HIT: ${key}`);
    } else {
      this.logger.debug(`Cache MISS: ${key}`);
    }
    return value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    this.logger.debug(`Cache SET: ${key} (TTL: ${ttl || 'default'})`);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.debug(`Cache DELETE: ${key}`);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // Note: cache-manager-ioredis doesn't support pattern matching directly
    // For production, you might use Redis directly with KEYS + DEL
    this.logger.warn(
      `Cache invalidation pattern: ${pattern} - implement if needed`
    );
  }
}
