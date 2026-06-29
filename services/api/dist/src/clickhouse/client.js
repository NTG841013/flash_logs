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
exports.ClickhouseService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../infra/constants");
const schema_1 = require("./schema");
let ClickhouseService = class ClickhouseService {
    client;
    isInitialized = false;
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        this.tryInitializeSchema();
    }
    async tryInitializeSchema() {
        if (!this.client || this.isInitialized)
            return;
        try {
            await (0, schema_1.createLogsTable)(this.client);
            this.isInitialized = true;
            console.log('ClickHouse schema initialized');
        }
        catch (err) {
            console.error('Failed to initialize ClickHouse schema, retrying in 10s:', err.message);
            setTimeout(() => this.tryInitializeSchema(), 10000);
        }
    }
    async insertLogs(logs) {
        if (!this.client || logs.length === 0)
            return;
        if (!this.isInitialized) {
            console.warn('[ClickhouseService] Not initialized, dropping logs or re-initialize triggered');
            this.tryInitializeSchema();
            return;
        }
        try {
            await this.client.insert({
                table: 'logs',
                values: logs.map(log => ({
                    ...log,
                    metadata: typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : (log.metadata || '{}'),
                })),
                format: 'JSONEachRow',
            });
        }
        catch (err) {
            console.error('Failed to insert logs into ClickHouse:', err);
            throw err;
        }
    }
    async queryLogs(projectId, limit = 100) {
        if (!this.client)
            return [];
        try {
            const resultSet = await this.client.query({
                query: `
          SELECT * FROM logs 
          WHERE projectId = {projectId:String} 
          ORDER BY timestamp DESC 
          LIMIT {limit:UInt32}
        `,
                query_params: { projectId, limit },
                format: 'JSONEachRow',
            });
            return await resultSet.json();
        }
        catch (err) {
            console.error('Failed to query logs from ClickHouse:', err);
            return [];
        }
    }
};
exports.ClickhouseService = ClickhouseService;
exports.ClickhouseService = ClickhouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CLICKHOUSE_CLIENT)),
    __metadata("design:paramtypes", [Object])
], ClickhouseService);
//# sourceMappingURL=client.js.map