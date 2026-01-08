export interface MidtransErrorResponse {
  status_code: string;
  status_message: string;
  error_messages?: string[];
}

export class MidtransHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly data?: MidtransErrorResponse,
    message?: string
  ) {
    super(message);
    this.name = 'MidtransHttpError';
  }
}
