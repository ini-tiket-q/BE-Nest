import { PaymentParams } from "../../../models";

export interface IMidtransPaymentPort {
  /**
   * Generates the redirect URL for the user to pay
   */
  generateSnapUrl(params: PaymentParams): Promise<string>;
}