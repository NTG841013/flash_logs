import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LRUCache } from 'lru-cache';
import Redis from 'ioredis';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../../database/schema';
export interface ApiKeyCacheValue {
    userId: string;
    id: string;
    hash: string;
    expiresAt: number;
    apiKeyDigest: string;
}
export declare class ApiKeyService implements OnModuleInit {
    private db;
    private redis;
    private lru;
    private configService;
    constructor(db: NeonHttpDatabase<typeof schema>, redis: Redis, lru: LRUCache<string, ApiKeyCacheValue>, configService: ConfigService);
    onModuleInit(): void;
    trackApiKeyLastUsed(keyId: string): Promise<void>;
    syncLastUsedToDb(): Promise<void>;
    create(userId: string, options?: {
        name?: string;
        scope?: string;
        expiresAt?: string;
    }, planLimit?: number): Promise<{
        key: string;
        id: string;
        name: string;
        userId: string;
        scope: string;
        prefix: string;
        value: string;
        createdAt: Date;
        expiresAt: Date | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }>;
    list(userId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        scope: string;
        prefix: string;
        value: string;
        createdAt: Date;
        expiresAt: Date | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    revoke(id: string, userId: string): Promise<import("drizzle-orm/neon-http").NeonHttpQueryResult<never> | null>;
    validateKey(rawKey: string): Promise<ApiKeyCacheValue>;
    private formatUuid;
}
