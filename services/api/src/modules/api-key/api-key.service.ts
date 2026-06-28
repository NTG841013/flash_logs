import {
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { REDIS_CLIENT } from '../../infra/redis.module';
import { LRU_CACHE } from '../../infra/cache.module';
import { ConfigService } from '@nestjs/config';
import { apiKeys } from '../../database/schema';
import { eq, and, isNull, inArray, sql } from 'drizzle-orm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { LRUCache } from 'lru-cache';
import Redis from 'ioredis';
import { extractKeyId, verifyApiKey } from '../../utils/api-key-verifier';
import { digest } from '../../utils/key-digest';

import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../../database/schema';

export interface ApiKeyCacheValue {
  userId: string;
  id: string;
  hash: string;
  expiresAt: number;
  apiKeyDigest: string;
}

const VERSION = 'v1';
const LAST_USED_DEBOUNCE_SEC = 60;
const LAST_USED_HASH = `OML:api_key:last_used:${VERSION}`;
const REDIS_HARD_TTL = 3600; // 1 hour

@Injectable()
export class ApiKeyService implements OnModuleInit {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    @Inject(REDIS_CLIENT) private redis: Redis,
    @Inject(LRU_CACHE) private lru: LRUCache<string, ApiKeyCacheValue>,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    // Background sync every 5 minutes
    setInterval(() => this.syncLastUsedToDb(), 1000 * 60 * 5);
  }

  async trackApiKeyLastUsed(keyId: string) {
    const lockKey = `OML:api_key:last_used_lock:${VERSION}:${keyId}`;

    const ok = await this.redis.set(
      lockKey,
      '1',
      'EX',
      LAST_USED_DEBOUNCE_SEC,
      'NX',
    );

    if (!ok) return;

    await this.redis.hset(LAST_USED_HASH, keyId, Date.now().toString());
  }

  async syncLastUsedToDb() {
    try {
      const data = await this.redis.hgetall(LAST_USED_HASH);
      const keyIds = Object.keys(data);
      if (keyIds.length === 0) return;

      console.log(`[ApiKeyService] Syncing lastUsedAt for ${keyIds.length} keys`);

      // In a real production environment, we'd chunk this if there are thousands of keys
      for (const keyId of keyIds) {
        const timestampValue = parseInt(data[keyId]);
        const uuid = this.formatUuid(keyId);
        
        await this.db
          .update(apiKeys)
          .set({ lastUsedAt: new Date(timestampValue) })
          .where(eq(apiKeys.id, uuid));
        
        // Remove from hash after sync
        await this.redis.hdel(LAST_USED_HASH, keyId);
      }
    } catch (error) {
      console.error('[ApiKeyService] Failed to sync lastUsedAt to DB:', error);
    }
  }

  async create(userId: string, options: { name?: string; scope?: string; expiresAt?: string } = {}, planLimit: number = 5) {
    // 0. Check limit based on plan
    const activeKeys = await this.list(userId);
    if (activeKeys.length >= planLimit) {
      throw new ForbiddenException(
        `Limit of ${planLimit} API keys reached for your plan. Please upgrade to increase your limit.`,
      );
    }

    // 1. Generate Raw Key
    const publicId = crypto.randomUUID().replace(/-/g, '');
    const secret = crypto.randomBytes(24).toString('base64url'); // ~32 chars
    const rawKey = `OML_${publicId}_${secret}`;

    // 2. Hash Secret part (or full key for safety, we choose full key)
    const hashedValue = await argon2.hash(rawKey);

    // Calculate expiry date
    let expiryDate: Date | null = null;
    if (options.expiresAt === '30 Days') {
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
    } else if (options.expiresAt === '90 Days') {
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
    }

    // 3. Store in DB
    const [apiKey] = await this.db
      .insert(apiKeys)
      .values({
        id: this.formatUuid(publicId),
        userId,
        name: options.name || 'New Key',
        scope: options.scope || 'Full Access',
        prefix: rawKey.substring(0, 8) + '...', // OML_abc...
        value: hashedValue,
        expiresAt: expiryDate,
      })
      .returning();

    // 4. Return plaintext key once
    return {
      ...apiKey,
      key: rawKey,
    };
  }

  async list(userId: string) {
    return this.db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
  }

  async revoke(id: string, userId: string) {
    const [apiKey] = await this.db
      .select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.id, id),
          eq(apiKeys.userId, userId),
          isNull(apiKeys.revokedAt),
        ),
      );

    if (!apiKey) {
      return null;
    }

    // Invalidate cache
    const keyId = apiKey.id.replace(/-/g, '');
    const cacheKey = digest(
      keyId,
      this.configService.getOrThrow<string>('REDIS_KEY_SECRET'),
    );
    await this.redis.del(cacheKey);
    this.lru.delete(cacheKey);

    return this.db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
  }

  async validateKey(rawKey: string) {
    const keyId = extractKeyId(rawKey);
    if (!keyId) throw new UnauthorizedException('Invalid key format');

    const redisKeySecret = this.configService.getOrThrow<string>('REDIS_KEY_SECRET');
    const d = digest(keyId, redisKeySecret);
    const rKeyDigest = `OML:api_key:${VERSION}:${keyId}`;

    // 1. LRU Cache
    const lruHit = this.lru.get(d);
    if (lruHit) return lruHit;

    // 2. Redis Cache (Hash-based)
    try {
      const rDigest = await this.redis.hgetall(rKeyDigest);
      
      if (rDigest?.invalid === '1') {
        throw new UnauthorizedException('Unauthorized');
      }

      if (rDigest?.apiKeyDigest && rDigest?.apiKeyDigest !== d) {
        throw new UnauthorizedException('Unauthorized!');
      }

      if (rDigest?.userId) {
        const result: ApiKeyCacheValue = {
          userId: rDigest.userId,
          id: this.formatUuid(keyId),
          hash: rDigest.hash || '', // May be empty if using digest-only check, but service needs it for fallback
          expiresAt: Date.now() + 1000 * 60 * 60,
          apiKeyDigest: d,
        };
        this.lru.set(d, result);
        return result;
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      console.warn('Redis error:', e.message);
    }

    // 3. Database
    const [apiKey] = await this.db
      .select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.id, this.formatUuid(keyId)),
          isNull(apiKeys.revokedAt),
        ),
      );

    if (!apiKey) {
      // Negative cache: mark as invalid in Redis
      await this.redis.hset(rKeyDigest, { invalid: '1' });
      await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
      throw new UnauthorizedException('Unauthorized');
    }

    const isValid = await verifyApiKey(rawKey, apiKey.value);
    if (!isValid) {
      // Negative cache for this keyId
      await this.redis.hset(rKeyDigest, { invalid: '1' });
      await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
      throw new UnauthorizedException('Unauthorized!');
    }

    const result: ApiKeyCacheValue = {
      userId: apiKey.userId,
      id: apiKey.id,
      hash: apiKey.value,
      expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour cache
      apiKeyDigest: d,
    };

    // Repopulate caches
    try {
      await this.redis.hset(rKeyDigest, {
        userId: result.userId,
        apiKeyDigest: d,
        hash: result.hash,
      });
      await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
    } catch (e) {
      console.warn('Redis set error:', e.message);
    }
    this.lru.set(d, result);

    return result;
  }

  private formatUuid(id: string) {
    // Add hyphens back to uuid if needed for DB query
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }
}
