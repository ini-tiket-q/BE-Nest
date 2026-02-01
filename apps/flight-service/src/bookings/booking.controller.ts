import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetBookingUseCase,
  GetBookingDetailsUseCase,
  BookingResponseDto,
  BookingDetailResponseDto,
} from '@tiketq-be/flights';

@Controller('bookings')
@ApiTags('bookings')
export class BookingController {
  constructor(
    private readonly getBookingUseCase: GetBookingUseCase,
    private readonly getBookingDetailsUseCase: GetBookingDetailsUseCase
  ) {}

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

  @Get(':bookingCode/details')
  @ApiOperation({
    summary: 'Get booking details with flight info',
    description: 'Retrieve complete booking details including flight information',
  })
  @ApiResponse({ status: 200, type: BookingDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingCode', type: String, example: 'JKT-146751' })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async getBookingDetails(@Param('bookingCode') bookingCode: string) {
    return this.getBookingDetailsUseCase.execute(bookingCode);
  }
}
