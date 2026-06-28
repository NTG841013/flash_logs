# Session Memory

## Context
- **Project**: Flash Logs
- **Phase**: Phase 4 — Core Logic & Integrations
- **Task**: 07 API Key Management (Advanced Upgrade)
- **Finished**: 
    - **UI/UX Refinement**: Aligned dashboard grid (Health matching Sources), improved border visibility (white/10), and optimized Sidebar utilization.
    - **Port Synchronization**: Standardized both frontend and backend on port `8080`.
    - **Environment Decoupling**: Created `apps/main-dashboard/.env.local` and removed hardcoded URLs from frontend pages.
    - **Advanced API Keys**: Integrated high-fidelity API Key management with one-time secret reveal, friendly names, scopes, and expiry.
    - **DB Schema**: Pushed new `name`, `scope`, and `expires_at` columns to Neon PostgreSQL.
    - **Backend Resilience**: Refactored `NatsModule` and `ClickhouseModule` to prevent app crashes when infrastructure is offline.
    - **CORS Fix**: Explicitly allowed `x-user-id` and `cache-control` headers to solve "Failed to fetch" browser issues.
    - **API Hardening**: Added `ValidationPipe` (via `class-validator`) for automatic DTO validation and URI Versioning (`/api/v1`) for future-proof API stability.
    - **URL Standardization**: Resolved "Failed to fetch" errors by aligning frontend fetch paths with backend URI versioning and global prefix configurations.
    - **Authentication & Security**: Implemented a dual-layer authentication system (Clerk for dashboard, API Key Guard for ingestion). Hardened API key verification with strict regex and dual-layer caching (LRU + Redis). Generated cryptographically secure Redis secrets.
    - **Log Ingestion**: Built the first iteration of the high-throughput ingestion API with NATS Jetstream integration.
    - **High-Performance Verification**: Integrated a "fast-path" local LRU cache in `ApiKeyGuard` and implemented Redis-based debouncing for `last_used_at` updates to ensure sub-millisecond API response times.
    - **Background Sync**: Added a module-level background task in `ApiKeyService` to periodically batch-sync API key usage timestamps from Redis to the Neon database.
    - **Billing & Settings**: Created a new `/settings` route with a tabbed interface (Profile, Organization, Billing). Refactored the backend to enforce API key limits based on Clerk public metadata (Free: 2, Pro/Enterprise: Dynamic).
    - **Intelligent Sidebar**: Updated the dashboard Sidebar to dynamically display the user's active plan, organization name, and profile image using Clerk hooks.
    - **Security Hardening**: Integrated "negative caching" for invalid API keys in Redis to prevent DB stress. Upgraded API key validation to use Redis Hashes for efficient metadata storage.
    - **Clerk Authentication**: Refined `ClerkAuthGuard` error handling to match premium SDK feedback patterns ("ensure you are using our SDK").
    - **Performance**: Standardized the sub-millisecond validation path across `ApiKeyGuard` and `ApiKeyService` using HMAC-based cache keys.
    - **Next Step**: Phase 5 — Ingestion Scale & Processing. Setting up ClickHouse sinks and advanced log filtering.

## What was built
- **Dashboard UI**:
    - `Sidebar.tsx`: Added `mounted` check to fix hydration drift; increased vertical spacing and item size. Dynamic plan badges and org/user info via Clerk hooks.
    - `ApiKeysPage.tsx`: Completely rebuilt with shadcn-style `Table`, `Dialog`, `Select`, and `Tooltip`. Supports one-time reveal and metadata.
    - `SettingsPage`: New tabbed settings at `/settings` for Profile, Org, and Billing.
    - `layout.tsx`: Integrated `sonner` Toaster and `TooltipProvider`.
- **UI System**:
    - New components in `apps/main-dashboard/components/ui/`: `Button`, `Input`, `Table`, `Dialog`, `Select`, `Tooltip`.
    - `globals.css`: Corrected `.dark` variables to use premium HSL tokens.
- **Backend API**:
    - `ApiKeyService`: Enhanced `create` to handle metadata and calculate expiry.
    - `ApiKeyController`: Added `@Body()` validation and standard `POST /revoke` and `POST /generate-secret-key` endpoints.
    - `main.ts`: Robust CORS, health check (`/api/health`), and 0.0.0.0 host binding.

## Decisions & Patterns
- **Hydration Safety**: Use `mounted` state in Client Components that have significant SSR vs Client visual drift.
- **Infrastructure Tolerance**: Infrastructure modules must return `null` instead of throwing in factories to allow app bootstrap even if NATS/ClickHouse are down.
- **CORS Pre-flight**: Explicitly list all custom headers (like `x-user-id`) in `allowedHeaders`.
- **Environment Consistency**: Use `envFilePath: ['.env', '../.env']` in NestJS to ensure workspace-level variables are loaded.

## Current State
- **Authentication**: Dual-layer system (Clerk JWT for Dashboard, API Keys for Ingestion) fully implemented and hardened.
- **API Keys**: Advanced lifecycle (Create, List, Revoke) fully functional with metadata, strict format validation, and secure verification.
- **Performance**: High-speed "fast-path" validation for Ingestion API with Redis-backed usage tracking and periodic DB sync.
- **Log Ingestion**: `POST /logs/ingest` functional with `ApiKeyGuard` and NATS Jetstream publisher.
- **Live Logs**: SSE gateway (`/logs/stream`) implemented with infrastructure-offline resilience.
- **Known Issues**: NATS/ClickHouse require Docker to be running for full feature availability (handled gracefully if offline).

## Developer Handoff
- Backend is on `http://localhost:8080`.
- Dashboard is on `http://localhost:3000`.
- Run `npm run dev:api` and `npm run dev:dashboard`.
- Ensure Docker is up (`services/api/src/infra/docker-compose.yml`) for NATS features.
