import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { MidtransHttpError } from '../exception/midtrans-http-error';

export function handleMidtransError(error: unknown): void {
  if (error instanceof MidtransHttpError) {
    const status = error.status;
    const errorMessages =
      error.data?.error_messages?.join(', ') ||
      error.data?.status_message ||
      error.message ||
      'Unknown error';

    if (status === 400) {
      throw new BadRequestException(
        `Invalid request to Midtrans: ${errorMessages}`
      );
    }

    if (status === 401) {
      throw new UnauthorizedException(
        `Access denied: Invalid Midtrans Server Key - ${errorMessages}`
      );
    }

    if (status === 403) {
      throw new UnauthorizedException(
        `Access forbidden: Insufficient permissions - ${errorMessages}`
      );
    }

    if (status === 404) {
      throw new NotFoundException(
        `Midtrans endpoint not found - ${errorMessages}`
      );
    }

    if (status === 500) {
      throw new InternalServerErrorException(
        `Midtrans internal server error: ${errorMessages}`
      );
    }

    if (status === 502) {
      throw new BadGatewayException(
        `Bad gateway: Midtrans temporarily unavailable - ${errorMessages}`
      );
    }

    if (status === 503) {
      throw new ServiceUnavailableException(
        `Service unavailable: Midtrans under maintenance - ${errorMessages}`
      );
    }

    if (status === 504) {
      throw new BadGatewayException(
        `Gateway timeout: Midtrans took too long to respond - ${errorMessages}`
      );
    }

    if (status >= 500) {
      throw new InternalServerErrorException(
        `Midtrans server error (${status}): ${errorMessages}`
      );
    }

    throw new InternalServerErrorException(
      `Unknown Midtrans error (${status}): ${errorMessages}`
    );
  }

  throw new ServiceUnavailableException(
    'Unable to connect to Midtrans: Network error or timeout'
  );
}
