import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    REDIS_KEY_SECRET: z.ZodDefault<z.ZodString>;
    CLERK_SECRET_KEY: z.ZodOptional<z.ZodString>;
    CLERK_PUBLISHABLE_KEY: z.ZodOptional<z.ZodString>;
    NATS_URL: z.ZodOptional<z.ZodString>;
    CLICKHOUSE_URL: z.ZodDefault<z.ZodString>;
    CLICKHOUSE_USER: z.ZodDefault<z.ZodString>;
    CLICKHOUSE_PASSWORD: z.ZodDefault<z.ZodString>;
    CLICKHOUSE_DATABASE: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
export declare const configuration: () => {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    REDIS_KEY_SECRET: string;
    CLICKHOUSE_URL: string;
    CLICKHOUSE_USER: string;
    CLICKHOUSE_PASSWORD: string;
    CLICKHOUSE_DATABASE: string;
    CLERK_SECRET_KEY?: string | undefined;
    CLERK_PUBLISHABLE_KEY?: string | undefined;
    NATS_URL?: string | undefined;
};
