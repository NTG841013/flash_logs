"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const cache_module_1 = require("../infra/cache.module");
const lru_cache_1 = require("lru-cache");
const api_key_service_1 = require("../modules/api-key/api-key.service");
const api_key_verifier_1 = require("../utils/api-key-verifier");
const key_digest_1 = require("../utils/key-digest");
const config_1 = require("@nestjs/config");
let ApiKeyGuard = class ApiKeyGuard {
    lru;
    apiKeyService;
    configService;
    version = 'v1';
    redisKeySecret;
    constructor(lru, apiKeyService, configService) {
        this.lru = lru;
        this.apiKeyService = apiKeyService;
        this.configService = configService;
        this.redisKeySecret = this.configService.getOrThrow('REDIS_KEY_SECRET');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKeyHeader = request.headers['x-api-key'] || request.headers['authorization'];
        if (!apiKeyHeader) {
            throw new common_1.UnauthorizedException('API key is missing');
        }
        const rawKey = apiKeyHeader.startsWith('Bearer ')
            ? apiKeyHeader.split(' ')[1]
            : apiKeyHeader;
        const keyId = (0, api_key_verifier_1.extractKeyId)(rawKey);
        if (!keyId) {
            throw new common_1.UnauthorizedException('Invalid API key format');
        }
        const now = Date.now();
        const redisKeySecret = this.configService.getOrThrow('REDIS_KEY_SECRET');
        const cacheKey = (0, key_digest_1.digest)(keyId, redisKeySecret);
        const lruKey = `${this.version}:${keyId}`;
        try {
            const cached = this.lru.get(cacheKey);
            if (cached && cached.expiresAt > now && cached.apiKeyDigest === cacheKey) {
                request.user = {
                    id: cached.userId,
                    keyId,
                };
                request.apiKeyId = cached.id;
                void this.apiKeyService.trackApiKeyLastUsed(keyId);
                return true;
            }
            const validated = await this.apiKeyService.validateKey(rawKey);
            request.user = {
                id: validated.userId,
                keyId,
            };
            request.apiKeyId = validated.id;
            void this.apiKeyService.trackApiKeyLastUsed(keyId);
            return true;
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException)
                throw e;
            throw new common_1.UnauthorizedException('Unauthorized!');
        }
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_module_1.LRU_CACHE)),
    __metadata("design:paramtypes", [lru_cache_1.LRUCache,
        api_key_service_1.ApiKeyService,
        config_1.ConfigService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map