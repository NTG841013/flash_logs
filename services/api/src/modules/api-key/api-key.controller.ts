import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';
import type { Request as ExpressRequest } from 'express';
import { CreateApiKeyDto, RevokeApiKeyDto } from './dto/api-key.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
  };
  apiKeyId: string;
}

@Controller('api-keys')
@UseGuards(ClerkAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateApiKeyDto,
  ): Promise<any> {
    const userId = req.user.id;
    // Extract plan limit from Clerk metadata if available, fallback to 2 (Free)
    const publicMetadata = (req.user as any).metadata?.public || {};
    const planLimit = publicMetadata.apiKeyLimit || 2; 
    
    return this.apiKeyService.create(userId, body, planLimit);
  }

  @Post('revoke')
  async revokeBody(
    @Request() req: AuthenticatedRequest,
    @Body() body: RevokeApiKeyDto,
  ): Promise<any> {
    const userId = req.user.id;
    const result = await this.apiKeyService.revoke(body.id, userId);
    if (!result) {
      // If result is null, it means key was not found or already revoked
      return { success: false, message: 'Key not found or already revoked' };
    }
    return result;
  }

  @Post('generate-secret-key')
  async generateSecret(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateApiKeyDto,
  ): Promise<any> {
    const userId = req.user.id;
    return this.apiKeyService.create(userId, body);
  }

  @Get()
  async list(@Request() req: AuthenticatedRequest): Promise<any[]> {
    const userId = req.user.id;
    return this.apiKeyService.list(userId);
  }

  @Get('validate')
  @UseGuards(ApiKeyGuard)
  validate(@Request() req: AuthenticatedRequest): {
    valid: boolean;
    userId: string;
    apiKeyId: string;
  } {
    return {
      valid: true,
      userId: req.user.id,
      apiKeyId: req.apiKeyId,
    };
  }

  @Delete(':id')
  async revoke(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user.id;
    const result = await this.apiKeyService.revoke(id, userId);
    if (!result) {
      return { success: false, message: 'Key not found or already revoked' };
    }
    return result;
  }
}
