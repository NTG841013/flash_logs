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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClerkAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
let ClerkAuthGuard = class ClerkAuthGuard {
    configService;
    clerkClient;
    constructor(configService) {
        this.configService = configService;
        const secretKey = this.configService.get('CLERK_SECRET_KEY');
        this.clerkClient = (0, clerk_sdk_node_1.createClerkClient)({ secretKey });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
        }
        const token = authHeader.split(' ')[1];
        try {
            const sessionClaims = await this.clerkClient.verifyToken(token);
            request.user = {
                id: sessionClaims.sub,
                ...sessionClaims,
            };
            return true;
        }
        catch (e) {
            console.error('[ClerkAuthGuard] Token verification failed:', e.message);
            throw new common_1.UnauthorizedException('something went wrong! please ensure you are using our SDK');
        }
    }
};
exports.ClerkAuthGuard = ClerkAuthGuard;
exports.ClerkAuthGuard = ClerkAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ClerkAuthGuard);
//# sourceMappingURL=clerk-auth.guard.js.map