"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nats_1 = require("nats");
const constants_1 = require("./constants");
let NatsModule = class NatsModule {
};
exports.NatsModule = NatsModule;
exports.NatsModule = NatsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: constants_1.NATS_CLIENT,
                useFactory: async (configService) => {
                    const servers = configService.get('NATS_URL', 'nats://localhost:4222');
                    try {
                        const nc = await (0, nats_1.connect)({
                            servers,
                            name: 'flash-logs-api',
                            waitOnFirstConnect: false,
                            reconnect: true,
                            maxReconnectAttempts: -1,
                        });
                        console.log(`NATS client initialized for ${servers}`);
                        return nc;
                    }
                    catch (err) {
                        console.error(`[CRITICAL] NATS failed to initialize: ${err.message}. App will continue but NATS features will be disabled.`);
                        return null;
                    }
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [constants_1.NATS_CLIENT],
    })
], NatsModule);
//# sourceMappingURL=nats.module.js.map