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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const nats = __importStar(require("nats"));
const common_2 = require("@nestjs/common");
const constants_1 = require("../../infra/constants");
const api_key_guard_1 = require("../../guards/api-key.guard");
const ingest_log_dto_1 = require("./dto/ingest-log.dto");
const client_1 = require("../../clickhouse/client");
let IngestionController = class IngestionController {
    natsConnection;
    clickhouseService;
    jc = nats.JSONCodec();
    constructor(natsConnection, clickhouseService) {
        this.natsConnection = natsConnection;
        this.clickhouseService = clickhouseService;
    }
    async ingest(body, req) {
        const { projectId, message, level, metadata, timestamp } = body;
        const logEvent = {
            message,
            level,
            projectId,
            metadata: metadata || {},
            timestamp: timestamp || new Date().toISOString(),
            userId: req.user.id,
            apiKeyId: req.apiKeyId,
        };
        if (this.natsConnection) {
            const subject = `logs.${projectId}.${level}`;
            this.natsConnection.publish(subject, this.jc.encode(logEvent));
        }
        else {
            console.warn('[Ingestion] NATS not available, log dropped or simulation only');
        }
        return { success: true };
    }
    async queryLogs(projectId, limit) {
        return this.clickhouseService.queryLogs(projectId, limit ? Number(limit) : 100);
    }
    streamLogs(projectId) {
        console.log(`Starting log stream for project: ${projectId}`);
        const subject = `logs.${projectId}.*`;
        return new rxjs_1.Observable(observer => {
            if (!this.natsConnection) {
                observer.next({ data: { type: 'error', message: 'NATS not available' } });
                return;
            }
            const subscription = this.natsConnection.subscribe(subject, {
                callback: (err, msg) => {
                    if (err) {
                        console.error('NATS subscription error', err);
                        return;
                    }
                    const data = this.jc.decode(msg.data);
                    observer.next({
                        data,
                    });
                }
            });
            const heartbeat = setInterval(() => {
                observer.next({ data: { type: 'heartbeat' } });
            }, 15000);
            return () => {
                subscription.unsubscribe();
                clearInterval(heartbeat);
                console.log(`Stopped log stream for project: ${projectId}`);
            };
        });
    }
};
exports.IngestionController = IngestionController;
__decorate([
    (0, common_1.Post)('ingest'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_log_dto_1.IngestLogDto, Object]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "ingest", null);
__decorate([
    (0, common_1.Get)('query/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "queryLogs", null);
__decorate([
    (0, common_1.Sse)('stream/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], IngestionController.prototype, "streamLogs", null);
exports.IngestionController = IngestionController = __decorate([
    (0, common_1.Controller)('logs'),
    __param(0, (0, common_2.Inject)(constants_1.NATS_CLIENT)),
    __metadata("design:paramtypes", [Object, client_1.ClickhouseService])
], IngestionController);
//# sourceMappingURL=ingestion.controller.js.map