import { Logger } from "@nestjs/common";

export class SearchFlightsUseCase {
  private readonly logger = new Logger(SearchFlightsUseCase.name);

  constructor(
    private flightVendor: FlightVendorPort,
    private redisCache: RedisCacheService,  // NEW
  ) {}

  async execute(query: SearchFlightsQuery) {
    const { origin, destination, date, minPrice, maxPrice, airline, stops } = query;

    // Generate cache key from search parameters
    const cacheKey = this.generateCacheKey(query);
    const CACHE_TTL = 15 * 60; // 15 minutes

    // Try cache first
    const cached = await this.redisCache.get<any[]>(cacheKey);
    if (cached) {
      this.logger.log(`Returning cached flights for ${cacheKey}`);
      return this.applyFilters(cached, { minPrice, maxPrice, airline, stops });
    }

    // Cache miss - call MMBC API
    this.logger.log(`Cache miss - calling MMBC API for ${cacheKey}`);
    let flights = await this.flightVendor.searchFlights(origin, destination, date);

    // Apply filters BEFORE caching (so filtered results are cached)
    flights = this.applyFilters(flights, { minPrice, maxPrice, airline, stops });

    // Save to cache for 15 minutes
    await this.redisCache.set(cacheKey, flights, CACHE_TTL);
    this.logger.log(`Cached ${flights.length} flights for ${CACHE_TTL}s (15 minutes)`);

    return flights;
  }

  private generateCacheKey(query: SearchFlightsQuery): string {
    // Create unique key from search params
    const params = `${query.origin}-${query.destination}-${query.date}`;
    const hash = require('crypto').createHash('md5').update(params).digest('hex');
    return `flights:search:${hash}`;
  }

  private applyFilters(flights: any[], filters: any): any[] {
    // Apply all filters
    let result = flights;

    if (filters.minPrice !== undefined) {
      result = result.filter(f => f.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(f => f.price <= filters.maxPrice);
    }
    if (filters.airline) {
      result = result.filter(f => f.airlineId === filters.airline);
    }
    if (filters.stops === '0') {
      result = result.filter(f => f.stops === 0);
    }

    return result;
  }
}

export interface SearchFlightsQuery {
  origin: string;
  destination: string;
  date: Date;
  minPrice?: number;
  maxPrice?: number;
  airline?: string;
  stops?: '0' | '1' | '2+';
}