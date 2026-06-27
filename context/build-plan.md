# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation & Authentication

### 01 Landing Page & Branding
Build the complete marketing website for Flash Logs.

**UI:**
- Hero section with "Set up in under a minute" headline and premium dark aesthetic.
- Terminal-style integration showcase (`LandingSetup.tsx`).
- Features grid highlighting ingestion speed and search.
- Pricing table and FAQ.

**Logic:**
- "Get Started" and "Login" links directed to sign-up/sign-in pages.

---

### 02 Authentication (Clerk)
Implement secure authentication using Clerk as the entry point.Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu etc.

**Logic:**
- Set up Clerk Application.
- Implement Sign-in and Sign-up pages with Google and Email providers etc.
- Configure User Organization and Profile image handling.
- Protect dashboard routes using Clerk middleware.
- login button to redirect to sign in and "get started", "start monitoring for free" and "get started for free" redirect to sign up.
- ## Design

Use Clerk's `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk appearance variable using the app's existing CSS variables. Do not hardcode colors.

### Sign-in and sign-up pages:

- large screens: simple two-panel layout
- left: compact logo, tagline, short text-only feature list
- right: centered Clerk form
- small screens: form only
- no gradients
- no oversized hero images
- no feature cards
- no scroll-heavy layouts

Keep the layout minimal and professional.

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's dark theme.

Create sign-in and sign-up pages using Clerk components.

Use `proxy.ts` at the project root, not `middleware.ts`.

Define public routes using existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:

- authenticated users redirect to `/dashboard`
- unauthenticated users redirect to `/sign-in`

Add Clerk's built-in `UserButton` to the editor navbar right section for profile settings and logout

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals.

Use existing Clerk env vars. Do not rename or invent new ones.

---

## Phase 2 — System Design & Infrastructure

### 03 Backend Foundation (NestJS)
Initialize the scalable backend services.

**Logic:**
- Scaffold NestJS project in `services/`.
- Configure Environment variables and Global Configs.
- Define Module structure (API Keys, Ingestion, Database, Infra).
- Set up Neon PostgreSQL connection via Drizzle ORM as a global NestJS module.
- Define initial `api_key` schema and run first migration.

---

### 04 High-Performance Infrastructure
Set up the core data pipeline components.

**Logic:**
- **NATS Jetstream**: Implement as the message broker for high-throughput log ingestion.
- **ClickHouse**: Configure as the primary time-series database for log storage.
- **Redis**: Set up via Docker Compose (`redis:7-alpine`). Configure `ioredis` module in NestJS infra.
- **LRU Cache**: Implement in-process `lru-cache` module as the first validation layer.
- **Fast Validation Cache**: Wire LRU + Redis into a two-layer validation pipeline targeting 0–1ms API key verification.

---

## Phase 3 — Dashboard & Real-time UI

### 05 Dashboard Shell & Mock Data
Build the main dashboard container and navigation with initial state.

**UI:**
- Sidebar with navigation: Dashboard, Live Logs, Alerts, Integrations, API Keys.
- Top bar with project switcher and user profile.
- Stat cards and Charts with mock data.

---

### 06 Live Logs Page & SSE
Build the core logging interface with real-time streaming.

**UI:**
- Search/Query bar at the top.
- Real-time streaming log table with level badges.
- Expandable rows for JSON payloads.

**Logic:**
- **Server-Sent Events (SSE)**: Implement the SSE gateway for one-way real-time streaming from backend to UI.
- Client-side state management to append logs to the live view.

---

## Phase 4 — Core Logic & Integrations

### 07 API Key Management
Production-ready API key module for SDK integration.

**Logic:**
- Neon PostgreSQL `api_key` table via Drizzle ORM.
- CRUD operations: create, list, revoke (soft delete), regenerate.
- API key format: `OML_<publicUUID>_<secret>` — UUID stored in DB, full key hashed with Argon2id.
- `AuthGuard` (`og.g.ts`) in NestJS — extracts public UUID, digests it, checks LRU → Redis → Neon, attaches `userId` to request.
- Cache invalidation on revoke and regenerate (both LRU and Redis).
- Maximum 5 active keys per user enforced at the service layer.
- `last_used_at` tracked in Redis in real time; batch-synced to Neon periodically.

---

### 07b Billing (Clerk)
Add subscription plans and usage tracking.

**Logic:**
- Configure plans and subscriptions in the Clerk dashboard (Stripe-backed, no additional Stripe SDK needed).
- Surface the active plan and usage limits in the Settings page.
- Enforce plan-based limits (e.g. log retention, ingest rate) at the guard/middleware level.

---

### 08 Ingestion API & Alerting
Complete the loop from SDK to Storage to Alerts.

**Logic:**
- `POST /api/logs/ingest` endpoint with `AuthGuard` for key validation.
- Batch processing in Log Workers (every 5 seconds) to ClickHouse.
- **Smart Alerts**: Implement alerting engine with Webhook notifications.

---

### 09 SDKs & Integration Guides
Build the interactive setup guides for developers.

**UI:**
- Framework selectors (Next.js, Express, NestJS, etc.).
- Code snippet copy-paste blocks with the user's actual API key.