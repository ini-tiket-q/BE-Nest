export interface PaymentParams {
  transaction_details: TransactionDetails;
}

export interface TransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface IMidtransPaymentPort {
  /**
   * Generates the redirect URL for the user to pay
   */
  generateSnapUrl(
    params: PaymentParams
  ): Promise<{ token: string; redirect_url: string }>;
  createTransaction<T, U>(path: string, params: U): Promise<T>;
  isRetryableError(status: number | undefined): boolean;
  calculateBackoffDelay(retryCount: number): number;
}
