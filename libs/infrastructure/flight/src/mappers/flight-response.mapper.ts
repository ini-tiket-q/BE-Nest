import { FlightRoute } from '../../../../domain/flights/src/lib/flight-route.interface';

export class FlightResponseMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(vendorData: any): FlightRoute {
    
    const cleanPrice = parseFloat(vendorData.flight_price);

    const times = vendorData.flight_datetime?.split(' ') || ['00:00', '00:00'];
    const departureIso = `${vendorData.flight_date}T${times[0]}:00`;
    const arrivalIso = `${vendorData.flight_date}T${times[1]}:00`;
    
    return {
      airline: vendorData.flight,
      airlineLogo: vendorData.flight_image, 
      flightNumber: vendorData.flight_code,
      price: cleanPrice,
      departureTime: departureIso,
      arrivalTime: arrivalIso,
      duration: '0h 0m', // Bisa dihitung nanti
      transit: vendorData.flight_transit === 'Nonstop' ? 0 : 1,
    };
  }
}