"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configs_1 = require("./configs");
const database_module_1 = require("./database/database.module");
const redis_module_1 = require("./infra/redis.module");
const cache_module_1 = require("./infra/cache.module");
const nats_module_1 = require("./infra/nats.module");
const clickhouse_module_1 = require("./infra/clickhouse.module");
const app_controller_1 = require("./controllers/app.controller");
const app_service_1 = require("./controllers/app.service");
const api_key_module_1 = require("./modules/api-key/api-key.module");
const ingestion_module_1 = require("./modules/ingestion/ingestion.module");
const workers_module_1 = require("./modules/workers/workers.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configs_1.configuration],
                envFilePath: ['.env', '../.env'],
            }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            cache_module_1.CacheModule,
            nats_module_1.NatsModule,
            clickhouse_module_1.ClickhouseModule,
            api_key_module_1.ApiKeyModule,
            ingestion_module_1.IngestionModule,
            workers_module_1.WorkersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map