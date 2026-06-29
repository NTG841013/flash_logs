import * as crypto from 'crypto';
import * as argon2 from 'argon2';

export function extractKeyId(plainKey: string): string | null {
  if (!plainKey || !plainKey.startsWith('OML_')) return null;

  const parts = plainKey.split('_');

  if (parts.length < 3) return null;
  const keyId = parts[1];

  if (!/^[a-f0-9]{32}$/i.test(keyId)) return null;

  return keyId;
}

export async function verifyApiKey(rawKey: string, hashedValue: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedValue, rawKey);
  } catch (e) {
    return false;
  }
}
