// import { ApiHeader, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

// @Get('search')
// @ApiOperation({
//   summary: 'Search flights with filters',
//   description: 'Search for available flights with optional price, airline, and stops filters'
// })
// @ApiResponse({ status: 200, type: [FlightResponse] })
// @ApiQuery({ name: 'origin', required: true, type: String, example: 'CGK' })
// @ApiQuery({ name: 'destination', required: true, type: String, example: 'DPS' })
// @ApiQuery({ name: 'date', required: true, type: String, example: '2024-01-15' })
// @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 500000 })
// @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 2000000 })
// @ApiQuery({ name: 'airline', required: false, type: String, example: 'GA' })
// @ApiQuery({ name: 'stops', required: false, enum: ['0', '1', '2+'], example: '0' })
// @ApiHeader({ name: 'X-Correlation-ID', required: false })
// async searchFlights(@Query() query: SearchFlightsDto) {
//   return this.searchFlightsUseCase.execute(query);
// }