import { Injectable, Logger } from '@nestjs/common';
import {
  IBookingVendorPort,
  Booking,
  BookingWithDetails,
  BookingPassenger,
  BookingContact,
  BookingPricing,
  BookingFlightInfo,
  BookingStatus,
} from '@tiketq-be/flights_domain';
import { MmbcService } from '../services/mmbc.service';
import {
  MmbcBookingSuccessResponseDto,
  MmbcPassengerJson,
  MmbcContactJson,
} from '../dtos/mmbc-booking-response.dto';

@Injectable()
export class MmbcBookingAdapter implements IBookingVendorPort {
  private readonly logger = new Logger(MmbcBookingAdapter.name);

  constructor(private readonly mmbcService: MmbcService) {}

  async getBookingStatus(bookingCode: string): Promise<Booking | null> {
    const response = await this.mmbcService.getBookingStatus(bookingCode);

    if (response.result === 'no') {
      this.logger.warn(
        `Booking not found: ${bookingCode} - ${response.reason}`
      );
      return null;
    }

    return this.mapToBooking(response);
  }

  async getBookingStatusWithDetails(
    bookingCode: string
  ): Promise<BookingWithDetails | null> {
    const response = await this.mmbcService.getBookingStatus(bookingCode);

    if (response.result === 'no') {
      this.logger.warn(
        `Booking not found: ${bookingCode} - ${response.reason}`
      );
      return null;
    }

    return this.mapToBookingWithDetails(response);
  }

  private mapToBooking(response: MmbcBookingSuccessResponseDto): Booking {
    return {
      bookingCode: response.kodebooking,
      transactionId: response.tid,
      bookingDate: response.tanggal,
      status: this.mapStatus(response.flight_statusbooking),
      totalPassengers: parseInt(response.flight_totalpassenger, 10) || 0,
      passengers: this.parsePassengers(response.flight_datapassengers_json),
      contact: this.parseContact(response.flight_contactdetails_json),
      pricing: this.mapPricing(response),
      timeLimit: response.flight_timelimit,
      bookedBy: response.flight_bookingby,
      bookedByAgentCode: response.flight_bookingby_kodeagen,
      issuedDate: response.flight_issued_date || undefined,
      ticketNumber: response.flight_issued_ticketnumber || undefined,
      issuedBy: response.flight_issuedby || undefined,
      issuedByAgentCode: response.flight_issuedby_kodeagen || undefined,
    };
  }

  private mapToBookingWithDetails(
    response: MmbcBookingSuccessResponseDto
  ): BookingWithDetails {
    const booking = this.mapToBooking(response);
    const flight = this.mapFlightInfo(response);

    return {
      ...booking,
      flight,
    };
  }

  private mapStatus(status: string): BookingStatus {
    const statusMap: Record<string, BookingStatus> = {
      waiting: 'WAITING',
      cancel: 'CANCEL',
      expired: 'EXPIRED',
      issued: 'ISSUED',
    };

    return statusMap[status.toLowerCase()] || 'WAITING';
  }

  private parsePassengers(json: string): BookingPassenger[] {
    try {
      const parsed: MmbcPassengerJson[] = JSON.parse(json);
      return parsed.map((p) => ({
        title: p.passenger_title,
        fullName: p.passenger_fullname,
        type: this.mapPassengerType(p.passenger_type),
        baggageIntl: p.passenger_baggageintl || undefined,
        ffNumber: p.passenger_ffnumber || undefined,
        dateOfBirth: p.passenger_dob || undefined,
        passportNumber: p.passenger_passportnumber || undefined,
        passportExpired: p.passenger_passportexpired || undefined,
      }));
    } catch (error) {
      this.logger.error('Failed to parse passengers JSON', error);
      return [];
    }
  }

  private mapPassengerType(type: string): 'Adult' | 'Child' | 'Infant' {
    const typeMap: Record<string, 'Adult' | 'Child' | 'Infant'> = {
      adult: 'Adult',
      child: 'Child',
      infant: 'Infant',
    };

    return typeMap[type.toLowerCase()] || 'Adult';
  }

  private parseContact(json: string): BookingContact {
    try {
      const parsed: MmbcContactJson = JSON.parse(json);
      return {
        title: parsed.contact_title,
        fullName: parsed.contact_fullname,
        email: parsed.contact_email,
        phone: parsed.contact_phone,
      };
    } catch (error) {
      this.logger.error('Failed to parse contact JSON', error);
      return {
        title: '',
        fullName: '',
        email: '',
        phone: '',
      };
    }
  }

  private mapPricing(response: MmbcBookingSuccessResponseDto): BookingPricing {
    return {
      currency: response.flight_currency,
      publishFare: parseFloat(response.flight_publishfare) || 0,
      tax: parseFloat(response.flight_tax) || 0,
      totalFare: parseFloat(response.flight_totalfare) || 0,
      realNta: parseFloat(response.flight_realnta) || 0,
      shownNta: parseFloat(response.flight_shownta) || 0,
      agentBonus: parseFloat(response.flight_bonus_agen) || 0,
    };
  }

  private mapFlightInfo(
    response: MmbcBookingSuccessResponseDto
  ): BookingFlightInfo {
    const [origin, destination] = this.parseRoute(response.flight_route);

    return {
      airline: response.flight,
      flightCode: response.flight_code,
      route: response.flight_route,
      origin,
      destination,
      departureDate: response.flight_departure,
      flightTime: response.flight_time,
      transitInfo: response.flight_transit,
      transitDetails: response.flight_infotransit,
      flightClass: response.flight_class,
    };
  }

  private parseRoute(route: string): [string, string] {
    const parts = route.split('-');
    if (parts.length >= 2) {
      return [parts[0].trim(), parts[1].trim()];
    }
    return ['', ''];
  }
}
