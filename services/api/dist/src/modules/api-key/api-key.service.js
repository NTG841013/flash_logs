"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const redis_module_1 = require("../../infra/redis.module");
const cache_module_1 = require("../../infra/cache.module");
const config_1 = require("@nestjs/config");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto = __importStar(require("crypto"));
const argon2 = __importStar(require("argon2"));
const lru_cache_1 = require("lru-cache");
const ioredis_1 = __importDefault(require("ioredis"));
const api_key_verifier_1 = require("../../utils/api-key-verifier");
const key_digest_1 = require("../../utils/key-digest");
const neon_http_1 = require("drizzle-orm/neon-http");
const VERSION = 'v1';
const LAST_USED_DEBOUNCE_SEC = 60;
const LAST_USED_HASH = `OML:api_key:last_used:${VERSION}`;
const REDIS_HARD_TTL = 3600;
let ApiKeyService = class ApiKeyService {
    db;
    redis;
    lru;
    configService;
    constructor(db, redis, lru, configService) {
        this.db = db;
        this.redis = redis;
        this.lru = lru;
        this.configService = configService;
    }
    onModuleInit() {
        setInterval(() => this.syncLastUsedToDb(), 1000 * 60 * 5);
    }
    async trackApiKeyLastUsed(keyId) {
        const lockKey = `OML:api_key:last_used_lock:${VERSION}:${keyId}`;
        const ok = await this.redis.set(lockKey, '1', 'EX', LAST_USED_DEBOUNCE_SEC, 'NX');
        if (!ok)
            return;
        await this.redis.hset(LAST_USED_HASH, keyId, Date.now().toString());
    }
    async syncLastUsedToDb() {
        try {
            const data = await this.redis.hgetall(LAST_USED_HASH);
            const keyIds = Object.keys(data);
            if (keyIds.length === 0)
                return;
            console.log(`[ApiKeyService] Syncing lastUsedAt for ${keyIds.length} keys`);
            for (const keyId of keyIds) {
                const timestampValue = parseInt(data[keyId]);
                const uuid = this.formatUuid(keyId);
                await this.db
                    .update(schema_1.apiKeys)
                    .set({ lastUsedAt: new Date(timestampValue) })
                    .where((0, drizzle_orm_1.eq)(schema_1.apiKeys.id, uuid));
                await this.redis.hdel(LAST_USED_HASH, keyId);
            }
        }
        catch (error) {
            console.error('[ApiKeyService] Failed to sync lastUsedAt to DB:', error);
        }
    }
    async create(userId, options = {}, planLimit = 5) {
        const activeKeys = await this.list(userId);
        if (activeKeys.length >= planLimit) {
            throw new common_1.ForbiddenException(`Limit of ${planLimit} API keys reached for your plan. Please upgrade to increase your limit.`);
        }
        const publicId = crypto.randomUUID().replace(/-/g, '');
        const secret = crypto.randomBytes(24).toString('base64url');
        const rawKey = `OML_${publicId}_${secret}`;
        const hashedValue = await argon2.hash(rawKey);
        let expiryDate = null;
        if (options.expiresAt === '30 Days') {
            expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
        }
        else if (options.expiresAt === '90 Days') {
            expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 90);
        }
        const [apiKey] = await this.db
            .insert(schema_1.apiKeys)
            .values({
            id: this.formatUuid(publicId),
            userId,
            name: options.name || 'New Key',
            scope: options.scope || 'Full Access',
            prefix: rawKey.substring(0, 8) + '...',
            value: hashedValue,
            expiresAt: expiryDate,
        })
            .returning();
        return {
            ...apiKey,
            key: rawKey,
        };
    }
    async list(userId) {
        return this.db
            .select()
            .from(schema_1.apiKeys)
            .where((0, drizzle_orm_1.eq)(schema_1.apiKeys.userId, userId));
    }
    async revoke(id, userId) {
        const [apiKey] = await this.db
            .select()
            .from(schema_1.apiKeys)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.apiKeys.id, id), (0, drizzle_orm_1.eq)(schema_1.apiKeys.userId, userId), (0, drizzle_orm_1.isNull)(schema_1.apiKeys.revokedAt)));
        if (!apiKey) {
            return null;
        }
        const keyId = apiKey.id.replace(/-/g, '');
        const cacheKey = (0, key_digest_1.digest)(keyId, this.configService.getOrThrow('REDIS_KEY_SECRET'));
        await this.redis.del(cacheKey);
        this.lru.delete(cacheKey);
        return this.db
            .update(schema_1.apiKeys)
            .set({ revokedAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.apiKeys.id, id), (0, drizzle_orm_1.eq)(schema_1.apiKeys.userId, userId)));
    }
    async validateKey(rawKey) {
        const keyId = (0, api_key_verifier_1.extractKeyId)(rawKey);
        if (!keyId)
            throw new common_1.UnauthorizedException('Invalid key format');
        const redisKeySecret = this.configService.getOrThrow('REDIS_KEY_SECRET');
        const d = (0, key_digest_1.digest)(keyId, redisKeySecret);
        const rKeyDigest = `OML:api_key:${VERSION}:${keyId}`;
        const lruHit = this.lru.get(d);
        if (lruHit)
            return lruHit;
        try {
            const rDigest = await this.redis.hgetall(rKeyDigest);
            if (rDigest?.invalid === '1') {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            if (rDigest?.apiKeyDigest && rDigest?.apiKeyDigest !== d) {
                throw new common_1.UnauthorizedException('Unauthorized!');
            }
            if (rDigest?.userId) {
                const result = {
                    userId: rDigest.userId,
                    id: this.formatUuid(keyId),
                    hash: rDigest.hash || '',
                    expiresAt: Date.now() + 1000 * 60 * 60,
                    apiKeyDigest: d,
                };
                this.lru.set(d, result);
                return result;
            }
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException)
                throw e;
            console.warn('Redis error:', e.message);
        }
        const [apiKey] = await this.db
            .select()
            .from(schema_1.apiKeys)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.apiKeys.id, this.formatUuid(keyId)), (0, drizzle_orm_1.isNull)(schema_1.apiKeys.revokedAt)));
        if (!apiKey) {
            await this.redis.hset(rKeyDigest, { invalid: '1' });
            await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const isValid = await (0, api_key_verifier_1.verifyApiKey)(rawKey, apiKey.value);
        if (!isValid) {
            await this.redis.hset(rKeyDigest, { invalid: '1' });
            await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
            throw new common_1.UnauthorizedException('Unauthorized!');
        }
        const result = {
            userId: apiKey.userId,
            id: apiKey.id,
            hash: apiKey.value,
            expiresAt: Date.now() + 1000 * 60 * 60,
            apiKeyDigest: d,
        };
        try {
            await this.redis.hset(rKeyDigest, {
                userId: result.userId,
                apiKeyDigest: d,
                hash: result.hash,
            });
            await this.redis.expire(rKeyDigest, REDIS_HARD_TTL);
        }
        catch (e) {
            console.warn('Redis set error:', e.message);
        }
        this.lru.set(d, result);
        return result;
    }
    formatUuid(id) {
        return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __param(1, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __param(2, (0, common_1.Inject)(cache_module_1.LRU_CACHE)),
    __metadata("design:paramtypes", [neon_http_1.NeonHttpDatabase,
        ioredis_1.default,
        lru_cache_1.LRUCache,
        config_1.ConfigService])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map