export enum PaymentStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export class Payment {
  constructor(public id: string, public status: PaymentStatus) {}

  /**
   * Mark payment as paid
   */
  markAsPaid(): void {
    if (this.status === PaymentStatus.PAID) {
      throw new Error('Payment is already PAID');
    }
    if (this.status === PaymentStatus.FAILED) {
      throw new Error('Cannot mark a FAILED payment as PAID');
    }
    this.status = PaymentStatus.PAID;
  }

  /**
   * Mark payment as failed
   */
  markAsFailed(): void {
    if (this.status === PaymentStatus.PAID) {
      throw new Error('Payment is already PAID');
    }
    this.status = PaymentStatus.FAILED;
  }

  /**
   * Mark payment as pending
   */
  markAsPending(): void {
    if (this.status === PaymentStatus.PAID) {
      throw new Error('Payment is already PAID');
    }
    if (this.status === PaymentStatus.FAILED) {
      throw new Error('Cannot mark a FAILED payment as PENDING');
    }
    this.status = PaymentStatus.PENDING;
  }

  /**
   * Create a Payment entity from Midtrans callback status code
   * @param orderId - The order ID from Midtrans
   * @param statusCode - The status code from Midtrans (200 = PAID, 201 = PENDING, else = FAILED)
   * @returns Payment entity
   */
  static fromMidtransCallback(orderId: string, statusCode: string): Payment {
    let status: PaymentStatus;

    if (statusCode === '200') {
      status = PaymentStatus.PAID;
    } else if (statusCode === '201') {
      status = PaymentStatus.PENDING;
    } else {
      status = PaymentStatus.FAILED;
    }

    return new Payment(orderId, status);
  }
}
