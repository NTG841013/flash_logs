# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation & Authentication
**Last completed:** 01 Landing Page & Branding
**Next:** 02 Authentication (Clerk)

---

## Progress

### Phase 1 — Foundation & Authentication

- [x] 01 Landing Page & Branding
- [x] 02 Authentication (Clerk) - Background updated, social providers visibility improved, and premium UI applied to auth pages.
- [x] 01b UI Polishing & Refinement (Premium Aesthetic) - Matches ref image 2.png.

### Phase 2 — System Design & Infrastructure

- [ ] 03 Backend Foundation (NestJS)
- [ ] 04 High-Performance Infrastructure (NATS Jetstream, ClickHouse, and Fast Validation Cache)

### Phase 3 — Dashboard & Real-time UI

- [ ] 05 Dashboard Shell & Mock Data
- [ ] 06 Live Logs Page & SSE

### Phase 4 — Core Logic & Integrations

- [ ] 07 API Key Management
- [ ] 07b Billing (Clerk)
- [ ] 08 Ingestion API & Alerting
- [ ] 09 SDKs & Integration Guides

---

## Decisions Made During Build

- **Streaming Technology**: Chose Server-Sent Events (SSE) for one-way real-time log delivery as per system design (lower overhead than WebSockets for log streaming).
- **Backend Framework**: Adopted NestJS for the core services to leverage its modularity and high performance for log ingestion.
- **Message Broker**: Implemented NATS Jetstream for high-throughput, durable log processing.
- **Log Table Font**: Standardized on JetBrains Mono for all log-related UI elements to maintain a technical, readable feel.
- **Glassmorphism UI**: Adopted a glass panel aesthetic for dashboard cards to improve visual hierarchy on the dark background.
- **Carousel Animation**: Implemented a high-performance, interactive logo carousel using `framer-motion`. Includes pause-on-hover and mouse-following displacement for added depth. Extended this pattern to a dual-row Testimonials section with opposite scrolling directions and standardized slow-motion (60s duration) for a premium feel.
- **Application Database**: Chose Neon (serverless PostgreSQL) with Drizzle ORM for all application data (API keys, users, billing). ClickHouse is strictly for log data only.
- **ORM**: Drizzle ORM selected over Prisma for its lightweight footprint and first-class Neon support.
- **API Key Hashing**: Argon2id chosen as the hashing algorithm (industry standard). Raw keys are never stored. The `publicUUID` part of the key format enables fast cache-based validation without full re-hashing on every request.
- **API Key Format**: `OML_<publicUUID>_<secret>` — the prefix `OML` identifies Flash Logs keys, the UUID is the database ID used for cache lookups, and the secret is a 32-byte base64url random value.
- **Cache Strategy**: Two-layer validation cache — LRU in-process cache first, then Redis. Redis runs via Docker Compose co-located with the NestJS service for v1 to minimise latency. `last_used_at` is synced to Neon in batches, not on every request.
- **Redis Key Security**: API key IDs are never stored as raw UUIDs in Redis. They are passed through `digest()` (SHA-256 HMAC using `REDIS_KEY_SECRET`) before use as cache keys.
- **Billing**: Clerk's native billing (Stripe-backed) will be used. No separate Stripe integration needed. Billing is the next step before the ingestion API.
- **Date Formatting**: `date-fns` (already approved) to be used for all date formatting. `timeago.js` was used during development but should be replaced with `date-fns` to keep the dependency list clean.
- **Image Configuration**: Configured `avatar.vercel.sh` in `next.config.ts` to allow dynamic avatar generation for testimonials while maintaining Next.js image optimization security.
- **Premium Footer**: Replaced the basic footer with a high-impact design matching Land9. Added a glassmorphic CTA section, refined typography, and interactive social elements to close the landing page with a premium feel. Fixed build errors by implementing SVG icons for social links to ensure library version compatibility.
- **Typography**: Integrated the custom `Satoshi-Bold` font for headings, as defined in the UI tokens. Configured via `next/font/local` and mapped to the Tailwind `font-satoshi` utility for consistent application across the landing page.
- **Logo Standardization**: Unified the visual weight and coloring of all logos in `LogoCloud` and `LandingIntegrations`. Applied individual scaling factors to compensate for different aspect ratios and used a consistent grayscale filter with adjusted brightness and inversion for dark logos to ensure maximum visibility on the premium dark background.
- **Asset Migration**: Moved framework and partner logos from `app/assets` to `public/assets` and `public/logos` to ensure they are correctly served by the Next.js static asset handler.