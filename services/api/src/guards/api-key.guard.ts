import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { LRU_CACHE } from '../infra/cache.module';
import { LRUCache } from 'lru-cache';
import { ApiKeyService, ApiKeyCacheValue } from '../modules/api-key/api-key.service';
import { extractKeyId } from '../utils/api-key-verifier';
import { digest } from '../utils/key-digest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly version = 'v1';
  private readonly redisKeySecret: string;

  constructor(
    @Inject(LRU_CACHE) private lru: LRUCache<string, ApiKeyCacheValue>,
    private apiKeyService: ApiKeyService,
    private configService: ConfigService,
  ) {
    this.redisKeySecret = this.configService.getOrThrow<string>('REDIS_KEY_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'] || request.headers['authorization'];

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API key is missing');
    }

    // Handle 'Bearer <key>' format if used
    const rawKey = apiKeyHeader.startsWith('Bearer ') 
      ? apiKeyHeader.split(' ')[1] 
      : apiKeyHeader;

    const keyId = extractKeyId(rawKey);
    if (!keyId) {
      throw new UnauthorizedException('Invalid API key format');
    }

    const now = Date.now();
    const redisKeySecret = this.configService.getOrThrow<string>('REDIS_KEY_SECRET');
    const cacheKey = digest(keyId, redisKeySecret);
    const lruKey = `${this.version}:${keyId}`; // Keep for compatibility if needed, but we use cacheKey for lookups

    try {
      // 1. FAST-PATH: Local LRU Cache check
      const cached = this.lru.get(cacheKey);
      
      if (cached && cached.expiresAt > now && cached.apiKeyDigest === cacheKey) {
        request.user = {
          id: cached.userId,
          keyId,
        };
        request.apiKeyId = cached.id;
        
        // Asynchronously track usage
        void this.apiKeyService.trackApiKeyLastUsed(keyId);
        
        return true;
      }

      // 2. SLOW-PATH: Fallback to Service (Redis/DB)
      const validated = await this.apiKeyService.validateKey(rawKey);
      
      // Attach user and key info to the request
      request.user = {
        id: validated.userId,
        keyId,
      };
      request.apiKeyId = validated.id;
      
      // Track usage for slow-path too
      void this.apiKeyService.trackApiKeyLastUsed(keyId);
      
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Unauthorized!');
    }
  }
}
