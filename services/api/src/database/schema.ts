import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull().default('Default Key'),
  scope: text('scope').notNull().default('Full Access'),
  prefix: text('prefix').notNull(),
  value: text('value').notNull(), // Argon2id hash
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  revokedAt: timestamp('revoked_at'),
});
