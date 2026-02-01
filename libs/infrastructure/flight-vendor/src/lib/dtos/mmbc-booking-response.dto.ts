// Base response (common field)
interface MmbcBookingResponseBase {
  result: string;
}
// Passenger details in JSON format
export interface MmbcPassengerJson {
  passenger_title: string;
  passenger_fullname: string;
  passenger_type: string;
  passenger_baggageintl?: string;
  passenger_ffnumber?: string;
  passenger_dob?: string;
  passenger_passportnumber?: string;
  passenger_passportexpired?: string;
}

// Contact details in JSON format
export interface MmbcContactJson {
  contact_title: string;
  contact_fullname: string;
  contact_email: string;
  contact_phone: string;
}

// Success response - all booking fields
export interface MmbcBookingSuccessResponseDto extends MmbcBookingResponseBase {
  result: 'ok';
  tid: string;
  tanggal: string;
  flight: string;
  flight_code: string;
  kodebooking: string;
  flight_route: string;
  flight_departure: string;
  flight_time: string;
  flight_transit: string;
  flight_infotransit: string;
  flight_class: string;
  flight_totalpassenger: string;
  flight_datapassengers_json: string;
  flight_contactdetails_json: string;
  flight_currency: string;
  flight_publishfare: string;
  flight_tax: string;
  flight_totalfare: string;
  flight_realnta: string;
  flight_shownta: string;
  flight_bonus_agen: string;
  flight_timelimit: string;
  flight_bookingby: string;
  flight_bookingby_kodeagen: string;
  flight_issued_date: string;
  flight_issued_ticketnumber: string;
  flight_issuedby: string;
  flight_issuedby_kodeagen: string;
  flight_statusbooking: string;
}

// Failed response - only reason
export interface MmbcBookingFailedResponseDto extends MmbcBookingResponseBase {
  result: 'no';
  reason: string;
}

// Union type for the actual response
export type MmbcBookingResponseDto =
  | MmbcBookingSuccessResponseDto
  | MmbcBookingFailedResponseDto;
