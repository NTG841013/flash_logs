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
exports.LogWorker = void 0;
const common_1 = require("@nestjs/common");
const nats = __importStar(require("nats"));
const constants_1 = require("../../infra/constants");
const client_1 = require("../../clickhouse/client");
let LogWorker = class LogWorker {
    natsConnection;
    clickhouseService;
    jc = nats.JSONCodec();
    subscription = null;
    batch = [];
    batchInterval = null;
    BATCH_SIZE = 1000;
    BATCH_TIME_MS = 5000;
    constructor(natsConnection, clickhouseService) {
        this.natsConnection = natsConnection;
        this.clickhouseService = clickhouseService;
    }
    async onModuleInit() {
        this.tryInitialize();
    }
    async tryInitialize() {
        if (!this.natsConnection) {
            console.warn('[LogWorker] NATS client not available, waiting 10s to retry...');
            setTimeout(() => this.tryInitialize(), 10000);
            return;
        }
        try {
            this.subscription = this.natsConnection.subscribe('logs.>', {
                callback: (err, msg) => {
                    if (err) {
                        console.error('[LogWorker] NATS subscription error:', err);
                        return;
                    }
                    this.handleMessage(msg);
                },
            });
            this.batchInterval = setInterval(() => this.flushBatch(), this.BATCH_TIME_MS);
            console.log('[LogWorker] Started and subscribed to logs.>');
        }
        catch (err) {
            console.error('[LogWorker] Failed to start, retrying in 10s:', err);
            setTimeout(() => this.tryInitialize(), 10000);
        }
    }
    handleMessage(msg) {
        try {
            const log = this.jc.decode(msg.data);
            this.batch.push(log);
            if (this.batch.length >= this.BATCH_SIZE) {
                this.flushBatch();
            }
        }
        catch (err) {
            console.error('[LogWorker] Failed to decode message:', err);
        }
    }
    async flushBatch() {
        if (this.batch.length === 0)
            return;
        const logsToInsert = [...this.batch];
        this.batch = [];
        try {
            await this.clickhouseService.insertLogs(logsToInsert);
            console.log(`[LogWorker] Flushed ${logsToInsert.length} logs to ClickHouse`);
        }
        catch (err) {
            console.error('[LogWorker] Failed to flush batch to ClickHouse:', err);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.batchInterval) {
            clearInterval(this.batchInterval);
        }
        this.flushBatch();
    }
};
exports.LogWorker = LogWorker;
exports.LogWorker = LogWorker = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.NATS_CLIENT)),
    __metadata("design:paramtypes", [Object, client_1.ClickhouseService])
], LogWorker);
//# sourceMappingURL=log.worker.js.map