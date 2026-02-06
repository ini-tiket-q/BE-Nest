import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@tiketq-be/flights_domain';

class BookingPassengerDto {
  @ApiProperty({ example: 'MR' })
  title: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ enum: ['Adult', 'Child', 'Infant'], example: 'Adult' })
  type: 'Adult' | 'Child' | 'Infant';

  @ApiPropertyOptional({ example: '20' })
  baggageIntl?: string;

  @ApiPropertyOptional({ example: 'GA123456' })
  ffNumber?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'A12345678' })
  passportNumber?: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  passportExpired?: string;
}

class BookingContactDto {
  @ApiProperty({ example: 'MR' })
  title: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @ApiProperty({ example: '081234567890' })
  phone: string;
}

class BookingPricingDto {
  @ApiProperty({ example: 'IDR' })
  currency: string;

  @ApiProperty({ example: 1000000 })
  publishFare: number;

  @ApiProperty({ example: 100000 })
  tax: number;

  @ApiProperty({ example: 1100000 })
  totalFare: number;

  @ApiProperty({ example: 950000 })
  realNta: number;

  @ApiProperty({ example: 980000 })
  shownNta: number;

  @ApiProperty({ example: 20000 })
  agentBonus: number;
}

class BookingFlightInfoDto {
  @ApiProperty({ example: 'Garuda Indonesia' })
  airline: string;

  @ApiProperty({ example: 'GA-123' })
  flightCode: string;

  @ApiProperty({ example: 'CGK-DPS' })
  route: string;

  @ApiProperty({ example: 'CGK' })
  origin: string;

  @ApiProperty({ example: 'DPS' })
  destination: string;

  @ApiProperty({ example: '2024-03-15' })
  departureDate: string;

  @ApiProperty({ example: '08:00 - 10:30' })
  flightTime: string;

  @ApiProperty({ example: 'Direct' })
  transitInfo: string;

  @ApiProperty({ example: '' })
  transitDetails: string;

  @ApiProperty({ example: 'Economy' })
  flightClass: string;
}

export class BookingResponseDto {
  @ApiProperty({ example: 'JKT-146751' })
  bookingCode: string;

  @ApiProperty({ example: 'TXN123456' })
  transactionId: string;

  @ApiProperty({ example: '2024-03-10' })
  bookingDate: string;

  @ApiProperty({
    enum: ['WAITING', 'CANCEL', 'EXPIRED', 'ISSUED'],
    example: 'WAITING',
  })
  status: BookingStatus;

  @ApiProperty({ example: 2 })
  totalPassengers: number;

  @ApiProperty({ type: [BookingPassengerDto] })
  passengers: BookingPassengerDto[];

  @ApiProperty({ type: BookingContactDto })
  contact: BookingContactDto;

  @ApiProperty({ type: BookingPricingDto })
  pricing: BookingPricingDto;

  @ApiProperty({ example: '2024-03-11 23:59:59' })
  timeLimit: string;

  @ApiProperty({ example: 'Agent Name' })
  bookedBy: string;

  @ApiProperty({ example: 'AGT001' })
  bookedByAgentCode: string;

  @ApiPropertyOptional({ example: '2024-03-11' })
  issuedDate?: string;

  @ApiPropertyOptional({ example: 'TKT123456789' })
  ticketNumber?: string;

  @ApiPropertyOptional({ example: 'Issuer Name' })
  issuedBy?: string;

  @ApiPropertyOptional({ example: 'AGT002' })
  issuedByAgentCode?: string;
}

export class BookingDetailResponseDto extends BookingResponseDto {
  @ApiProperty({ type: BookingFlightInfoDto })
  flight: BookingFlightInfoDto;
}
