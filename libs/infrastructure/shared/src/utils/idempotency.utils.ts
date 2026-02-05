import { createHash } from 'crypto';

export function hashRequestBody(body: any): string {
  return createHash('sha256')
    .update(JSON.stringify(body ?? {}))
    .digest('hex');
}
