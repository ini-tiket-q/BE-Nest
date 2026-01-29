
export class TransactionNotFoundException extends Error {
  public readonly transactionId: string
  constructor(transactionId: string) {
    super(`Transaction with ID ${transactionId} not found`);
    this.name = TransactionNotFoundException.name;
    this.transactionId = transactionId
  }
}