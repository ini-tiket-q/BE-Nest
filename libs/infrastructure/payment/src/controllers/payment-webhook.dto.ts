import { IsNotEmpty, IsString } from 'class-validator';

export class MidtransCallbackDto {
  // @IsString()
  // @IsNotEmpty()
  signature_key: string;

  // @IsString()
  // @IsNotEmpty()
  order_id: string;

  // @IsString()
  // @IsNotEmpty()
  status_code: string;

  // @IsString()
  // @IsNotEmpty()
  gross_amount: string;
}
