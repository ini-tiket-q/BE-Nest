import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetBookingUseCase, BookingResponseDto } from '@tiketq-be/flights';

@Controller('bookings')
@ApiTags('bookings')
export class BookingController {
  constructor(private readonly getBookingUseCase: GetBookingUseCase) {}

  @Get(':bookingCode')
  @ApiOperation({
    summary: 'Get booking by code',
    description: 'Retrieve booking details using the booking code',
  })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingCode', type: String, example: 'JKT-146751' })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getBooking(@Param('bookingCode') bookingCode: string) {
    return this.getBookingUseCase.execute(bookingCode);
  }
}
