import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { ApiKeyService, ApiKeyCacheValue } from '../modules/api-key/api-key.service';
import { ConfigService } from '@nestjs/config';
export declare class ApiKeyGuard implements CanActivate {
    private lru;
    private apiKeyService;
    private configService;
    private readonly version;
    private readonly redisKeySecret;
    constructor(lru: LRUCache<string, ApiKeyCacheValue>, apiKeyService: ApiKeyService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
