import { Payment } from '../entities/payment.entity';

export interface PaymentDetailsDto {
  id: string;
  status: string;
  amount: number;
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentRepositoryPort {
  /**
   * Save a payment to the database
   * @param payment The payment entity to save
   */
  save(payment: Payment): Promise<void>;

  /**
   * Find a payment by order ID
   * @param orderId The order ID to search for
   * @returns Payment with only id and status, or null if not found
   */
  findById(orderId: string): Promise<PaymentDetailsDto | null>;
}
