"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeys = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.apiKeys = (0, pg_core_1.pgTable)('api_keys', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.text)('user_id').notNull(),
    name: (0, pg_core_1.text)('name').notNull().default('Default Key'),
    scope: (0, pg_core_1.text)('scope').notNull().default('Full Access'),
    prefix: (0, pg_core_1.text)('prefix').notNull(),
    value: (0, pg_core_1.text)('value').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at'),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at'),
});
//# sourceMappingURL=schema.js.map