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
exports.ApiKeyController = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("./api-key.service");
const api_key_guard_1 = require("../../guards/api-key.guard");
const clerk_auth_guard_1 = require("../../guards/clerk-auth.guard");
const api_key_dto_1 = require("./dto/api-key.dto");
let ApiKeyController = class ApiKeyController {
    apiKeyService;
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async create(req, body) {
        const userId = req.user.id;
        const publicMetadata = req.user.metadata?.public || {};
        const planLimit = publicMetadata.apiKeyLimit || 2;
        return this.apiKeyService.create(userId, body, planLimit);
    }
    async revokeBody(req, body) {
        const userId = req.user.id;
        const result = await this.apiKeyService.revoke(body.id, userId);
        if (!result) {
            return { success: false, message: 'Key not found or already revoked' };
        }
        return result;
    }
    async generateSecret(req, body) {
        const userId = req.user.id;
        return this.apiKeyService.create(userId, body);
    }
    async list(req) {
        const userId = req.user.id;
        return this.apiKeyService.list(userId);
    }
    validate(req) {
        return {
            valid: true,
            userId: req.user.id,
            apiKeyId: req.apiKeyId,
        };
    }
    async revoke(id, req) {
        const userId = req.user.id;
        const result = await this.apiKeyService.revoke(id, userId);
        if (!result) {
            return { success: false, message: 'Key not found or already revoked' };
        }
        return result;
    }
};
exports.ApiKeyController = ApiKeyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('revoke'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, api_key_dto_1.RevokeApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "revokeBody", null);
__decorate([
    (0, common_1.Post)('generate-secret-key'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "generateSecret", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('validate'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ApiKeyController.prototype, "validate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "revoke", null);
exports.ApiKeyController = ApiKeyController = __decorate([
    (0, common_1.Controller)('api-keys'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyController);
//# sourceMappingURL=api-key.controller.js.map