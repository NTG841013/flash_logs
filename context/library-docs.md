# Library Documentation

Documentation for key libraries and tools used in Flash Logs.

---

## Next.js 16 (App Router)
The core framework for both the Landing Page and Dashboard.
- **Usage**: Server Components by default. Use `"use client"` sparingly for interactive parts (log stream, charts).
- **Docs**: [Next.js Documentation](https://nextjs.org/docs)

---

## Neon (Serverless PostgreSQL)
The primary relational database for all application data — users, API keys, billing, and alert rules.
- **Purpose**: Source of truth for everything that is not a log. ClickHouse owns logs; Neon owns everything else.
- **Client**: `@neondatabase/serverless` with the `ws` package required in Node.js environments (NestJS).
- **ORM**: Drizzle ORM (see below).
- **Hosting**: Neon serverless — no local PostgreSQL setup required. Create a project at [neon.tech](https://neon.tech) and paste the connection string into `DATABASE_URL`.
- **Note**: When using `@neondatabase/serverless` inside NestJS, you must set `neonConfig.webSocketConstructor = ws` in the database module, otherwise connections will hang.

---

## Drizzle ORM
Type-safe ORM used to define schema and query Neon PostgreSQL from the NestJS services layer.
- **Purpose**: Schema definition, migrations, and all SQL queries against the application database.
- **Config file**: `services/drizzle.config.ts` — points at `src/database/schema.ts` and reads `DATABASE_URL` from env.
- **Scripts**: `db:generate` (generate migrations), `db:migrate` (run migrations), `db:push` (push schema directly, for development).
- **Global module**: The Drizzle client is wrapped in a NestJS `@Global()` module (`database.module.ts`) so it can be injected anywhere without re-importing.
- **Docs**: [Drizzle Documentation](https://orm.drizzle.team/docs/overview)

---

## ClickHouse
High-performance columnar database for storing and querying billions of logs.
- **Purpose**: Log ingestion and analytical queries for dashboard charts. This is NOT used for application data — use Neon for that.
- **Client**: `clickhouse-js`
- **Analytics**: ClickHouse is also used for calculating real-time metrics like error rates and ingestion trends via SQL aggregations.

---

## Redis (via ioredis + Docker)
Distributed cache used as the second layer of the two-layer API key validation cache.
- **Purpose**: Shared fast cache for API key validation across NestJS instances. Also used for real-time `last_used_at` tracking before batch-syncing to Neon.
- **Client**: `ioredis`
- **Infrastructure**: Redis 7 Alpine runs via Docker Compose (`services/src/infra/docker-compose.yml`). Co-located on the same server as NestJS for v1 to minimise network latency.
- **Cache key format**: Keys are stored as `api_key:<version>:<digest(keyId)>` where the digest is a SHA-256 HMAC (not the raw UUID) produced by `key-digest.ts`.
- **Eviction policy**: `allkeys-lru` — Redis will evict least-recently-used keys when memory is full.
- **Important**: When a key is revoked or regenerated, it must be deleted from Redis immediately. Stale Redis hits bypass the Neon check and would allow access with a revoked key.

---

## LRU Cache (lru-cache)
In-process memory cache used as the first — and fastest — layer of API key validation.
- **Purpose**: Zero-latency key lookups within a single NestJS process. Checked before Redis.
- **Client**: `lru-cache` npm package.
- **Invalidation**: Must be deleted on key revocation and regeneration, same as Redis.

---

## Argon2
Industry-standard password hashing library used to hash API key values before storing in Neon.
- **Purpose**: Ensures that even if the database is compromised, raw API keys cannot be recovered.
- **Algorithm**: Argon2id (`argon2.argon2id`), time cost 3, memory cost 16, parallelism 1.
- **Important**: The full raw key is hashed with Argon2id on creation. On validation, the incoming key is verified against the stored hash with `argon2.verify()`. Only the `publicUUID` part of the key is used for cache lookups — not the full key — which is why this is fast at scale.

---

## NestJS
Modular and high-performance backend framework used for ingestion services and SSE gateways.
- **Purpose**: API endpoints, NATS producers/consumers, real-time streaming, and the API key/auth guard layer.
- **Docs**: [NestJS Documentation](https://docs.nestjs.com/)

---

## NATS Jetstream
High-throughput, durable message broker for the log ingestion pipeline.
- **Purpose**: Decoupling ingestion from storage and enabling horizontal scaling.
- **Client**: `nats.js`

---

## Server-Sent Events (SSE)
One-way real-time streaming protocol for delivering logs to the dashboard.
- **Implementation**: NestJS SSE gateway on the backend, `EventSource` on the frontend.
- **Benefit**: Lower overhead than WebSockets for one-way log streaming.

---

## Clerk
Authentication and user management service.
- **Usage**: Sign-in, sign-up, organization management, and billing/subscription plans.
- **Billing**: Clerk's native billing (Stripe-backed) is used for subscription management. No separate Stripe integration is needed.
- **Docs**: [Clerk Documentation](https://clerk.com/docs)

---

## Tailwind CSS v4
The styling engine.
- **Config**: Defined via `@theme` in `globals.css`.
- **Custom Classes**: `.glass`, `.gradient-text`, `.hover-lift`.

---

## Framer Motion
Animation library for UI transitions and live stream effects.
- **Usage**: Animating new log rows as they appear in the table.

---

## Lucide React
Icon set for the dashboard and landing page.

---

## Shadcn UI
High-quality, accessible UI primitives (Button, Input, Select, Tabs).
- **Location**: `components/ui/`