import {
    Controller,
    Patch,
    Param,
  } from '@nestjs/common';
  import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiTags,
  } from '@nestjs/swagger';
  import { CancelBookingUseCase } from 'libs/application/flights/src/use-cases/cancel-booking.use-case';
  
  @ApiTags('Bookings')
  @Controller('bookings')
  export class BookingController {
    constructor(
      private readonly cancelBookingUseCase: CancelBookingUseCase,
    ) {}
  
    @Patch(':bookingId/cancel')
    @ApiOperation({
      summary: 'Cancel a booking',
      description: 'Cancel a booking if it has not been paid or already cancelled',
    })
    @ApiParam({
      name: 'bookingId',
      type: String,
      description: 'Booking ID',
    })
    @ApiHeader({
      name: 'X-Correlation-ID',
      required: false,
    })
    @ApiResponse({
      status: 200,
      description: 'Booking cancelled successfully',
    })
    @ApiResponse({
      status: 404,
      description: 'Booking not found',
    })
    @ApiResponse({
      status: 400,
      description: 'Booking cannot be cancelled',
    })
    async cancelBooking(
      @Param('bookingId') bookingId: string,
    ) {
      return this.cancelBookingUseCase.execute(bookingId);
    }
  }
  