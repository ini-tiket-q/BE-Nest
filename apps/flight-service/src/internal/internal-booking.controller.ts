import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FinalizeBookingDto, FinalizeBookingUseCase } from '@tiketq-be/flights';
import { Internal } from '@tiketq-be/shared';

@Controller('internal')
@ApiTags('internal')
@ApiSecurity('internal-api-key')
export class InternalBookingController {
  constructor(
    private readonly finalizeBookingUseCase: FinalizeBookingUseCase
  ) {}

  @Post('flights/finalize-booking')
  @Internal()
  @ApiOperation({
    summary: 'Finalize booking after payment',
    description: 'Called by Transactions Service after successful payment',
  })
  @ApiResponse({
    status: 202,
    description: 'Accepted - processing in background',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiHeader({ name: 'X-Correlation-ID', required: false })
  async finalizeBooking(@Body() dto: FinalizeBookingDto) {
    return this.finalizeBookingUseCase.execute(dto);
  }
}
