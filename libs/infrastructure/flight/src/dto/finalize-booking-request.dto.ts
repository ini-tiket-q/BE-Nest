import { IsNotEmpty, IsString } from 'class-validator';

export class FinalizeBookingRequest {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsString()
  @IsNotEmpty()
  transactionId!: string;
}
