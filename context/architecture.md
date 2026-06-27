# Architecture

## Stack

| Layer                          | Tool                              | Purpose                                                     |
| ------------------------------ | --------------------------------- | ----------------------------------------------------------- |
| Framework                      | Next.js 16 (App Router)           | Full stack framework                                        |
| Backend services               | NestJS                            | Modular and high-performance backend services               |
| Application Database           | Neon (serverless PostgreSQL)      | Source of truth for users, API keys, billing, and alerts    |
| ORM                            | Drizzle ORM                       | Type-safe queries and schema migrations against Neon        |
| Ingestion & Storage            | ClickHouse                        | High-performance log ingestion and storage                  |
| Message Broker                 | NATS Jetstream                    | High-throughput durable log processing                      |
| Real-time Streaming            | Server-Sent Events (SSE)          | Real-time log delivery to dashboard                         |
| Auth                           | Clerk                             | Authentication and organization management                  |
| Billing                        | Clerk Billing (Stripe-backed)     | Subscription plans and usage limits                         |
| Analytics                      | ClickHouse                        | Dashboard metrics and time-series charts                    |
| Cache Layer                    | LRU Cache (in-process) + Redis    | Two-layer fast API key validation (0–1ms target)            |
| Cache Infrastructure           | Redis 7 (Docker)                  | Distributed cache for API key validation and last-used sync |
| UI Components                  | Tailwind CSS + shadcn/ui          | UI components and styling                                   |
| Animations                     | Framer Motion                     | Dashboard transitions and live log effects                  |
| Language                       | TypeScript strict                 | Throughout                                                  |

---

## Folder Structure

```
/
├── apps/
│   ├── landing-page/           → Next.js app for marketing and sign-up
│   └── main-dashboard/         → Next.js app for the core monitoring dashboard
├── services/                   → NestJS backend services
│   └── src/
│       ├── configs/            → Global environment config (index.ts)
│       ├── controllers/        → Top-level NestJS controllers
│       ├── database/           → Neon/Drizzle global module and schema
│       │   ├── database.module.ts
│       │   └── schema.ts       → Drizzle table definitions (api_key, etc.)
│       ├── guards/             → NestJS guards (AuthGuard / og.g.ts)
│       ├── infra/              → Infrastructure modules
│       │   ├── cache.module.ts → LRU in-process cache
│       │   ├── redis.module.ts → Redis client module
│       │   └── docker-compose.yml → Redis service definition
│       ├── modules/            → Feature modules
│       │   ├── api-key/        → api-key.controller.ts, api-key.service.ts, api-key.module.ts
│       │   ├── billing/        → Billing module (scaffolded)
│       │   ├── ingestion/      → Log ingestion and NATS producer
│       │   └── workers/        → Log processing and ClickHouse consumers
│       └── utils/              → Shared utilities
│           ├── api-key-verifier.ts → extractKeyId() — splits and validates key format
│           └── key-digest.ts       → digest() — SHA-256 encrypts key ID for Redis storage
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   ├── progress-tracker.md
│   └── code.md
├── packages/                   → Shared packages (if monorepo)
│   ├── sdk-next/               → Next.js SDK source
│   ├── sdk-express/            → Express SDK source
│   └── ui-configs/             → Shared tailwind/shadcn configs
```

### Main Dashboard App Structure (`apps/main-dashboard/`)

```
app/
├── layout.tsx                  → Root layout, Auth providers
├── page.tsx                    → Dashboard overview (Stats, Charts)
├── live-logs/
│   └── page.tsx                → Real-time log stream and search
├── alerts/
│   └── page.tsx                → Alert management
├── integrations/
│   └── page.tsx                → SDK setup guides
├── api-keys/
│   └── page.tsx                → API key management
├── settings/
│   └── page.tsx                → Account and project settings
└── api/
    ├── logs/
    │   ├── ingest/route.ts     → Log ingestion endpoint
    │   └── query/route.ts      → Log querying endpoint
    └── alerts/route.ts         → Alert CRUD and webhook triggers
```

---

## System Boundaries

| Folder        | Owns                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `app/`        | Pages and API routes only. No business logic.                                                          |
| `lib/`        | Services (ClickHouse, NATS), third-party client initialization.                                        |
| `actions/`    | Server Actions for UI-triggered mutations (Settings, Alerts, API Keys).                                |
| `components/` | UI components. Dashboard widgets, log table, live stream view.                                         |
| `hooks/`      | Custom React hooks for real-time data and search state.                                                |
| `types/`      | Global TypeScript types and interfaces.                                                                |

---

## Data Flow

### Log Ingestion

```
Application (SDK)
        ↓
POST /api/logs/ingest (Next.js or NestJS)
        ↓
AuthGuard — API key validation
  1. Extract public key ID from key string (extractKeyId)
  2. Digest key ID (SHA-256 via digest())
  3. Check LRU in-process cache (0ms hit)
  4. Check Redis cache (0–1ms hit)
  5. On cache miss: query Neon PostgreSQL, repopulate cache
        ↓
NATS Jetstream (Message Broker)
        ↓
Log Workers (Batch every 5 seconds)
        ↓
ClickHouse Write
```

### Log Querying (Live Logs)

```
User enters query in UI
        ↓
API route app/api/logs/query
        ↓
ClickHouse SQL Query
        ↓
JSON results to UI
```

### Real-time Streaming

```
Log Ingested (Log Workers)
        ↓
SSE Gateway (NestJS)
        ↓
EventSource (in Live Logs page)
        ↓
State update (append to log tail)
        ↓
Framer Motion animation (new row slide-in)
```

### Alerting

```
Log Ingested
        ↓
Check against active Alert Rules
        ↓
If threshold met: Trigger Webhook
        ↓
POST to user-defined URL
```

---

## Database Schema

### Neon PostgreSQL (Application Data — via Drizzle ORM)

This is the source of truth for all application entities. ClickHouse is for logs only.

#### `api_key` table

| Column       | Type        | Notes                                              |
| ------------ | ----------- | -------------------------------------------------- |
| id           | uuid        | Public key ID — used for cache lookup              |
| user_id      | text        | Clerk user ID — not null                           |
| prefix       | text        | First 18 chars of the raw key shown in the UI      |
| value        | text        | Argon2id hash of the full raw key — never plaintext|
| created_at   | timestamp   | Key creation time                                  |
| last_used_at | timestamp   | Updated via Redis batch sync, not on every request |
| revoked_at   | timestamp   | Null means active; populated means revoked         |

### ClickHouse (`logs` table — Log Storage)

| Column      | Type       | Notes                                                          |
| ----------- | ---------- | -------------------------------------------------------------- |
| id          | String     | Unique log ID                                                  |
| projectId   | String     | Index for project filtering                                    |
| timestamp   | DateTime64 | Event time (high precision)                                    |
| level       | Enum       | info, warning, error, success, debug, audit, metric            |
| source      | String     | App name or service name                                       |
| message     | String     | Log message                                                    |
| payload     | String     | JSON string for extra metadata                                 |
| ip          | String     | Ingested from IP                                               |

---

## API Key Design

API keys follow the format: `OML_<publicUUID>_<secret>`

| Part         | Example value          | Purpose                                                           |
| ------------ | ---------------------- | ----------------------------------------------------------------- |
| `OML`        | `OML`                  | Flag — identifies a Flash Logs key                                |
| `publicUUID` | `a1b2c3...` (no hyphens) | The key's `id` stored in Neon. Used for cache lookups.          |
| `secret`     | 32 random bytes (base64url) | Never stored raw. Full key is hashed with Argon2id before insert.|

**Why this structure:** Hashing the full key on every request to compare against the database is too slow at scale. Instead, we extract the `publicUUID` from the incoming key, look it up in cache or DB in O(1), then perform a single constant-time Argon2 verify. This makes validation ~3× faster than naive full-key hashing.

**Cache key storage:** The `publicUUID` is passed through `digest()` (SHA-256 HMAC with `REDIS_KEY_SECRET`) before being stored as a Redis key. Raw UUIDs are never stored as cache keys.

**API key limits:** Maximum 5 active keys per user. Exceeding this requires contacting support.

---

## Two-Layer Fast Validation Cache

API key validation uses two cache layers to achieve 0–1ms latency:

1. **LRU in-process cache** (`lru-cache`) — zero-latency, same-process memory. Hit rate is high for active keys on a single instance.
2. **Redis cache** (Docker, co-located on the same server for v1) — shared across instances. Falls back to Neon on a miss and repopulates both layers.

`last_used_at` is **not** written to Neon on every request. It is updated in Redis in real time and batch-synced to Neon every ~30 seconds to prevent database write amplification.

When an API key is revoked or regenerated, it is immediately deleted from both the Redis cache and the local LRU cache to prevent stale hits.

---

## Authentication

- **Provider**: Clerk.
- **Organization Support**: Native Clerk organizations.
- **Protected Routes**: Everything under `/dashboard`, `/live-logs`, etc. (using Clerk Middleware).
- **Public Routes**: Homepage (landing page).
- **Billing**: Clerk's native billing (Stripe-backed) used for subscription plan management. No additional billing library required.

---

## Invariants

- **Performance**: Average search time must be < 50ms.
- **Real-time**: Logs must appear in the dashboard within 100ms of ingestion.
- **Scalability**: Architecture must support 2M+ logs per minute.
- **Security**: API keys must never be stored as plaintext. Raw keys are hashed with Argon2id. Cache keys use SHA-256 HMAC digests.
- **Privacy**: No PII (Personally Identifiable Information) stored in system logs unless explicitly sent in payload.
- **Reliability**: Log ingestion must not fail even if the alerting system is down.
- **Key Limits**: One user cannot hold more than 5 active API keys without contacting support.