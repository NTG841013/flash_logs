import * as crypto from 'crypto';

export function digest(keyId: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(keyId)
    .digest('hex');
}
