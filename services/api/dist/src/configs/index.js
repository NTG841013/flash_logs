"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(8080),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url().default('redis://localhost:6379'),
    REDIS_KEY_SECRET: zod_1.z.string().min(32).default('56c8b0e8a7d1f2e3c4b5a6d7e8f90123456789abcdef0123456789abcdef0123'),
    CLERK_SECRET_KEY: zod_1.z.string().optional(),
    CLERK_PUBLISHABLE_KEY: zod_1.z.string().optional(),
    NATS_URL: zod_1.z.string().url().optional(),
    CLICKHOUSE_URL: zod_1.z.string().url().default('http://localhost:8123'),
    CLICKHOUSE_USER: zod_1.z.string().default('default'),
    CLICKHOUSE_PASSWORD: zod_1.z.string().default('flash'),
    CLICKHOUSE_DATABASE: zod_1.z.string().default('flash'),
});
const configuration = () => {
    const env = exports.envSchema.parse(process.env);
    return env;
};
exports.configuration = configuration;
//# sourceMappingURL=index.js.map