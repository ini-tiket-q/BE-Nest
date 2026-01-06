import { PaymentParams } from "../../transactions/models";

export interface IMidtransPaymentPort {
  /**
   * Generates the redirect URL for the user to pay
   */
  generateSnapUrl(params: PaymentParams): Promise<{ token: string, redirect_url: string }>;
}