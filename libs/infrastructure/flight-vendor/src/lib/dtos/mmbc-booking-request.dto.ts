import { IsNotEmpty, IsString } from 'class-validator';

export class MmbcBookingRequestDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  kodebooking!: string;
}
