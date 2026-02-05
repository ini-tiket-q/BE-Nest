import { IsString, IsNotEmpty, IsEnum, IsISO8601 } from 'class-validator';

export class FinalizeBookingDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsEnum(['PAID', 'FAILED'])
  status: 'PAID' | 'FAILED';

  @IsISO8601()
  timestamp: string;
}