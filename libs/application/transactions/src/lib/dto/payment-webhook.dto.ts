import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class VaNumberDto {
  @IsOptional()
  @IsString()
  va_number?: string;

  @IsOptional()
  @IsString()
  bank?: string;
}

class PaymentAmountDto {
  @IsOptional()
  @IsString()
  paid_at?: string;

  @IsOptional()
  @IsString()
  amount?: string;
}

export class MidtransCallbackDto {
  // ===== REQUIRED FIELDS =====
  @IsOptional()
  @IsString()
  transaction_id!: string;

  @IsNotEmpty()
  @IsString()
  signature_key!: string;

  @IsNotEmpty()
  @IsString()
  order_id!: string;

  @IsNotEmpty()
  @IsString()
  status_code!: string;

  @IsNotEmpty()
  @IsString()
  gross_amount!: string;

  @IsNotEmpty()
  @IsString()
  transaction_status!: string;

  @IsOptional()
  @IsString()
  payment_type!: string;

  // ===== OPTIONAL COMMON FIELDS =====
  @IsOptional()
  @IsString()
  transaction_time?: string;

  @IsOptional()
  @IsString()
  settlement_time?: string;

  @IsOptional()
  @IsString()
  expiry_time?: string;

  @IsOptional()
  @IsString()
  status_message?: string;

  @IsOptional()
  @IsString()
  merchant_id?: string;

  @IsOptional()
  @IsString()
  fraud_status?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  // ===== CREDIT CARD =====
  @IsOptional()
  @IsString()
  masked_card?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  card_type?: string;

  @IsOptional()
  @IsString()
  approval_code?: string;

  @IsOptional()
  @IsString()
  eci?: string;

  @IsOptional()
  @IsString()
  channel_response_code?: string;

  @IsOptional()
  @IsString()
  channel_response_message?: string;

  // ===== QRIS =====
  @IsOptional()
  @IsString()
  transaction_type?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  acquirer?: string;

  @IsOptional()
  @IsString()
  merchant_cross_reference_id?: string;

  // ===== BANK TRANSFER / VA =====
  @IsOptional()
  @IsString()
  permata_va_number?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaNumberDto)
  va_numbers?: VaNumberDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentAmountDto)
  payment_amounts?: PaymentAmountDto[];

  // ===== MANDIRI BILL (ECHANNEL) =====
  @IsOptional()
  @IsString()
  biller_code?: string;

  @IsOptional()
  @IsString()
  bill_key?: string;

  // ===== CSTORE (INDOMARET / ALFAMART) =====
  @IsOptional()
  @IsString()
  store?: string;

  @IsOptional()
  @IsString()
  payment_code?: string;
}
