import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  
  // Neon PostgreSQL
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  REDIS_KEY_SECRET: z.string().min(32).default('56c8b0e8a7d1f2e3c4b5a6d7e8f90123456789abcdef0123456789abcdef0123'),
  
  // Clerk
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  
  // NATS (Phase 2b)
  NATS_URL: z.string().url().optional(),
  
  // ClickHouse (Phase 2b)
  CLICKHOUSE_URL: z.string().url().default('http://localhost:8123'),
  CLICKHOUSE_USER: z.string().default('default'),
  CLICKHOUSE_PASSWORD: z.string().default('flash'),
  CLICKHOUSE_DATABASE: z.string().default('flash'),
});

export type Env = z.infer<typeof envSchema>;

export const configuration = () => {
  const env = envSchema.parse(process.env);
  return env;
};
