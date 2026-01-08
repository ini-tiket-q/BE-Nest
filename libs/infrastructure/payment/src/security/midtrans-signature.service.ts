import { createHash } from "crypto";

export function verifySignature(
  order_id: string,
  status_code: string,
  gross_amount: string,
  signature_key: string
): boolean {
  const server_key = process.env['SERVER_KEY'] || '';

  const input = order_id + status_code + gross_amount + server_key;

  const encrypted_input = createHash('sha512').update(input).digest('hex');

  if (encrypted_input !== signature_key) {
    return false;
  }
  return true;
}

