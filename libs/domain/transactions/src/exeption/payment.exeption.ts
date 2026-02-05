import { BadRequestException, NotFoundException } from '@nestjs/common';

export class PaymentSignatureInvalidException extends NotFoundException {
  constructor(message = 'Payment operation failed') {
    super(message);
    this.name = 'PaymentSignatureInvalidException';
  }
}

export class PaymentFailedException extends BadRequestException {
  constructor(message = 'Payment operation failed') {
    super(message);
    this.name = 'PaymentFailedException';
  }
}

export class PaymentNotFoundException extends NotFoundException {
  constructor(transactionId: string) {
    super(`Payment with transaction ID ${transactionId} not found`);
    this.name = 'PaymentNotFoundException';
  }
}

export class PaymentAlreadyProcessedException extends BadRequestException {
  constructor(status: string) {
    super(`Payment has already been processed with status: ${status}`);
    this.name = 'PaymentAlreadyProcessedException';
  }
}
