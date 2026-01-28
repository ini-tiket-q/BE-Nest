export interface PaymentParams {
  transaction_details: TransactionDetails;
}
export interface TransactionDetails {
  order_id: string;
  gross_amount: number;
}
