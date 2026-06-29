import { ApiKeyService } from './api-key.service';
import type { Request as ExpressRequest } from 'express';
import { CreateApiKeyDto, RevokeApiKeyDto } from './dto/api-key.dto';
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        id: string;
    };
    apiKeyId: string;
}
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(req: AuthenticatedRequest, body: CreateApiKeyDto): Promise<any>;
    revokeBody(req: AuthenticatedRequest, body: RevokeApiKeyDto): Promise<any>;
    generateSecret(req: AuthenticatedRequest, body: CreateApiKeyDto): Promise<any>;
    list(req: AuthenticatedRequest): Promise<any[]>;
    validate(req: AuthenticatedRequest): {
        valid: boolean;
        userId: string;
        apiKeyId: string;
    };
    revoke(id: string, req: AuthenticatedRequest): Promise<any>;
}
export {};
