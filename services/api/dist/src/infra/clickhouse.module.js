"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickhouseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@clickhouse/client");
const client_2 = require("../clickhouse/client");
const constants_1 = require("./constants");
let ClickhouseModule = class ClickhouseModule {
};
exports.ClickhouseModule = ClickhouseModule;
exports.ClickhouseModule = ClickhouseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: constants_1.CLICKHOUSE_CLIENT,
                useFactory: (configService) => {
                    try {
                        const url = configService.get('CLICKHOUSE_URL', 'http://localhost:8123');
                        const username = configService.get('CLICKHOUSE_USER', 'default');
                        const password = configService.get('CLICKHOUSE_PASSWORD', 'flash');
                        const database = configService.get('CLICKHOUSE_DATABASE', 'flash');
                        const client = (0, client_1.createClient)({
                            url,
                            username,
                            password,
                            database,
                            clickhouse_settings: {
                                date_time_input_format: 'best_effort',
                            },
                        });
                        console.log(`ClickHouse client initialized for ${url}`);
                        return client;
                    }
                    catch (err) {
                        console.error(`[CRITICAL] ClickHouse failed to initialize: ${err.message}. App will continue but logging storage will be disabled.`);
                        return null;
                    }
                },
                inject: [config_1.ConfigService],
            },
            client_2.ClickhouseService,
        ],
        exports: [constants_1.CLICKHOUSE_CLIENT, client_2.ClickhouseService],
    })
], ClickhouseModule);
//# sourceMappingURL=clickhouse.module.js.map