import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('flights')
@ApiTags('flights')
export class FlightController {
  @Get('search')
  @ApiOperation({
    summary: 'Search flights with filters',
    description:
      'Search for available flights with optional price, airline, and stops filters',
  })
  @ApiResponse({ status: 200, type: [FlightResponse] })
  @ApiQuery({ name: 'origin', required: true, type: String, example: 'CGK' })
  @ApiQuery({
    name: 'destination',
    required: true,
    type: String,
    example: 'DPS',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    example: 500000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    example: 2000000,
  })
  @ApiQuery({ name: 'airline', required: false, type: String, example: 'GA' })
  @ApiQuery({
    name: 'stops',
    required: false,
    enum: ['0', '1', '2+'],
    example: '0',
  })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async searchFlights(@Query() query: SearchFlightsDto) {
    return this.searchFlightsUseCase.execute(query);
  }

  @Get('airports')
  @ApiOperation({
    summary: 'Get all airports (cached)',
    description: 'Returns list of all airports. Data is cached for 30 days.',
  })
  @ApiResponse({ status: 200, type: [AirportResponse] })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getAirports() {
    return this.airportCacheService.getAllAirports();
  }

  @Post('admin/cache/invalidate')
  @ApiOperation({
    summary: 'Invalidate airport cache',
    description:
      'Manually invalidate the airport cache. Use after updating airport data.',
  })
  @ApiResponse({ status: 200, description: 'Cache invalidated' })
  async invalidateCache() {
    await this.airportCacheService.invalidate();
    return { message: 'Airport cache invalidated successfully' };
  }

  @Delete('admin/cache/flight-search')
  @ApiOperation({
    summary: 'Clear all flight search cache',
    description:
      'Clear all cached flight search results. Use if MMBC data is updated.',
  })
  @ApiResponse({ status: 200, description: 'Cache cleared' })
  async clearFlightSearchCache() {
    await this.redisCache.invalidatePattern('flights:search:*');
    return { message: 'Flight search cache cleared' };
  }
}
