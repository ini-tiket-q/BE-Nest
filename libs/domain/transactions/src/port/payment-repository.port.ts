import { Payment } from '../entities/payment.entity';

export interface IPaymentRepositoryPort {
  /**
   * Save a payment to the database
   * @param payment The payment entity to save
   */
  save(payment: Payment): Promise<void>;
}
