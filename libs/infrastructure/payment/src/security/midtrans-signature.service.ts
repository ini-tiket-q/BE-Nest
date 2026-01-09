import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class MidtransSignatureService {
  constructor(private configService: ConfigService) {}

  async verifySignature(
    order_id: string,
    status_code: string,
    gross_amount: string,
    signature_key: string
  ): Promise<boolean> {
    const server_key = this.configService.get<string>('SERVER_KEY');

    const input = order_id + status_code + gross_amount + server_key;

    const encrypted_input = createHash('sha512').update(input).digest('hex');

    if (encrypted_input !== signature_key) {
      return false;
    }
    return true;
  }
}
