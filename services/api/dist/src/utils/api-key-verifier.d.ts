export declare function extractKeyId(plainKey: string): string | null;
export declare function verifyApiKey(rawKey: string, hashedValue: string): Promise<boolean>;
