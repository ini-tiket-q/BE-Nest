import { createHash } from 'crypto';

export function verifySignature(
  signature_key: string,
  order_id: string,
  status_code: string,
  gross_amount: string
): boolean {
  const serverkey = process.env['SERVER_KEY'] || '';
  const token = order_id + status_code + gross_amount + serverkey;

  const encrypt = createHash('sha512').update(token).digest('hex');

  if (encrypt !== signature_key) {
    return false;
  }

  return true;
}
