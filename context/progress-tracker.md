# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 — Ingestion Scale & Processing
**Last completed:** 16 Dynamic Plan Limits
**Next:** 17 Ingestion SDK Expansion

---

## Progress

### Phase 1 — Foundation & Authentication
 
 - [x] 01 Landing Page & Branding
 - [x] 02 Authentication (Clerk) - Background updated, social providers visibility improved, premium UI applied to auth pages, and UserButton dropdown refined (duplicate buttons removed, items reordered to match 1.png).
 - [x] 01b UI Polishing & Refinement (Premium Aesthetic) - Matches ref image 2.png.
- [x] 01c VCS Setup - Pushed to GitHub.
- [x] 01d API Hardening - Integrated global ValidationPipes (with class-validator) and URI Versioning (v1) for robust, future-proof communications.

### Phase 2 — System Design & Infrastructure

- [x] 03 Backend Foundation (NestJS)
- [x] 04 High-Performance Infrastructure (NATS Jetstream, ClickHouse, and Fast Validation Cache) - Redis, LRU cache, NATS, and ClickHouse modules implemented. Docker Compose updated with all infrastructure components. **Note: NATS/ClickHouse now resilient to connection failures during bootstrap.**
- [x] API Key Limit Enforcement - Users restricted to 5 active API keys with support contact redirection.
- [x] Monorepo Restructuring - Separated `landing-page` and `main-dashboard` into `apps/` and centralized shared configurations.

### Phase 3 — Dashboard & Real-time UI

- [x] 05 Dashboard Shell & Overview Page - Rebuilt exactly as in `dashboard.png` (Flash Logs). Color scheme synchronized with landing page (Premium HSL variables) and sizing refined (Sidebar 64px, Topbar 14px) for high-fidelity professional density. **Update: Sidebar width and layout balanced, border visibility increased.**
- [x] 05b API Key Management Page (Dashboard) - Integrated into shell. Refined UI density to match high-fidelity spec. Fixed API connection issues (CORS, port mismatch, and global prefix).
- [x] 06 Live Logs Page & SSE - Real-time log streaming implemented using SSE and NATS Jetstream. Frontend UI built with connection status indicator and log table.

### Phase 4 — Core Logic & Integrations

- [x] 07 API Key Management - Advanced upgrade complete. Supports Friendly Names, Scopes, and Expiry. Includes one-time secret reveal and high-fidelity Detail Drawer.
- [x] 08 Ingestion API & Alerting - Initial high-throughput ingestion endpoint implemented with NATS integration and API Key validation.
- [x] 09 URL Standardization - Fixed multiple fetch URL mismatches across Dashboard and API Gateway to align with URI versioning (/api/v1).
- [x] 10 Implement Auth Guards - Refactored `ApiKeyGuard` for ingestion and implemented `ClerkAuthGuard` for dashboard-to-backend authentication.
- [x] 11 Hardened API Key Verification - Integrated Drizzle and Redis into `ApiKeyGuard` and created a centralized verification utility.
- [x] 12 Backend Configuration Sync - Fixed missing `CLERK_SECRET_KEY` and Redis URL in backend environment variables.
- [x] 13 Refined API Key Validation - Updated `extractKeyId` to include strict UUID validation via regex.
- [x] 14 API Key High-Performance Refinement - Integrated real-time usage tracking with Redis debouncing and sub-millisecond fast-path cache validation.
- [x] 14b Security Hardening (Snippets) - Integrated "negative caching" for invalid API keys, shifted to Redis Hashes for validation data, and refined Clerk authentication error messages to align with premium SDK patterns.
- [x] 15 Settings & Billing UI - Created `/settings` with Profile, Organization, and Billing tabs. Integrated Clerk profiles and usage bars.
- [x] 16 Dynamic Plan Limits - Refactored `ApiKeyService` and `Sidebar` to support dynamic plan-based limits and badges.
- [x] 16b API Key Retention (Revoked Status) - Updated backend and dashboard to keep revoked keys visible for auditing while disabling them.
- [ ] 17 Ingestion SDK Expansion

---

## Decisions Made During Build

- **Streaming Technology**: Chose Server-Sent Events (SSE) for one-way real-time log delivery as per system design (lower overhead than WebSockets for log streaming).
- **Backend Framework**: Adopted NestJS for the core services to leverage its modularity and high performance for log ingestion.
- **Message Broker**: NATS Jetstream planned for high-throughput, durable log processing (Infrastructure setup pending).
- **Ingestion & Storage**: ClickHouse planned for primary log storage (Infrastructure setup pending).
- **Log Table Font**: Standardized on JetBrains Mono for all log-related UI elements to maintain a technical, readable feel.
- **Glassmorphism UI**: Adopted a glass panel aesthetic for dashboard cards to improve visual hierarchy on the dark background.
- **Carousel Animation**: Implemented a high-performance, interactive logo carousel using `framer-motion`. Includes pause-on-hover and mouse-following displacement for added depth. Extended this pattern to a dual-row Testimonials section with opposite scrolling directions and standardized slow-motion (60s duration) for a premium feel.
- **Application Database**: Chose Neon (serverless PostgreSQL) with Drizzle ORM for all application data (API keys, users, billing). ClickHouse is strictly for log data only.
- **ORM**: Drizzle ORM selected over Prisma for its lightweight footprint and first-class Neon support.
- **API Key Hashing**: Argon2id chosen as the hashing algorithm (industry standard). Raw keys are never stored. The `publicUUID` part of the key format enables fast cache-based validation without full re-hashing on every request.
- **API Key Format**: `OML_<publicUUID>_<secret>` — the prefix `OML` identifies Flash Logs keys, the UUID is the database ID used for cache lookups, and the secret is a 32-byte base64url random value.
- **Next.js Export Standard**: Page components in `app/` directory (e.g., `page.tsx`) must use `export default function` to satisfy Next.js runtime requirements, even if the project standard generally favors named exports for other components.
- **Cache Strategy**: Two-layer validation cache — LRU in-process cache first, then Redis. Redis runs via Docker Compose co-located with the NestJS service for v1 to minimise latency. `last_used_at` is synced to Neon in batches, not on every request.
- **Redis Key Security**: API key IDs are never stored as raw UUIDs in Redis. They are passed through `digest()` (SHA-256 HMAC using `REDIS_KEY_SECRET`) before use as cache keys.
- **Billing**: Clerk's native billing (Stripe-backed) will be used. No separate Stripe integration needed. Billing is the next step before the ingestion API.
- **Date Formatting**: `date-fns` (already approved) to be used for all date formatting. `timeago.js` was used during development but should be replaced with `date-fns` to keep the dependency list clean.
- **Image Configuration**: Configured `avatar.vercel.sh` in `next.config.ts` to allow dynamic avatar generation for testimonials while maintaining Next.js image optimization security.
- **Premium Footer**: Replaced the basic footer with a high-impact design matching Land9. Added a glassmorphic CTA section, refined typography, and interactive social elements to close the landing page with a premium feel. Fixed build errors by implementing SVG icons for social links to ensure library version compatibility.
- **Typography**: Integrated the custom `Satoshi-Bold` font for headings, as defined in the UI tokens. Configured via `next/font/local` and mapped to the Tailwind `font-satoshi` utility for consistent application across the landing page.
- **Logo Standardization**: Unified the visual weight and coloring of all logos in `LogoCloud` and `LandingIntegrations`. Applied individual scaling factors to compensate for different aspect ratios and used a consistent grayscale filter with adjusted brightness and inversion for dark logos to ensure maximum visibility on the premium dark background.
- **Asset Migration**: Moved framework and partner logos from `app/assets` to `public/assets` and `public/logos` to ensure they are correctly served by the Next.js static asset handler.