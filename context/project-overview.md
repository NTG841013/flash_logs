# Project Overview

## About the Project

Flash Logs is a production-ready monitoring SaaS platform designed to be set up in under a minute. It is built for developers, small-scale applications, and startups who need to track their application logs, errors, and performance without the complexity and overhead of advanced tools like DataDog or Sentry.

Flash Logs provides a drop-in SDK that allows users to start streaming logs instantly. It features high ingestion capabilities, real-time log streaming, instant searching, and smart alerts with webhooks.

---

## The Problem It Solves

Traditional monitoring tools are often targeted at advanced projects and require significant setup time, including complex configurations, YAML files, and extensive documentation reading. This creates a "logging headache" for developers who just want to ship fast and see their logs in one place.

Flash Logs eliminates this overhead. By providing a simple SDK and a zero-config backend, it allows developers to focus on building their products while ensuring they have the visibility they need into their application's health.

---

## Pages

### Landing Page
- `/` → Homepage
- `/What we do` → Homepage
- `/features` → what we offer (see image Land4.png)
- `/intergrations` → SDK setup guides (Next.js, Express, etc.)(see image Land5.png)
- `/pricing` → pricing (see image Land8.png)
- `/log in` → auth page and billing

### Dashboard App
- `/dashboard` → Overview with stats, charts, and activity feed
- `/live-logs` → Real-time log streaming and instant search/querying
- `/alerts` → Smart alert configuration and webhook management
- `/integrations` → SDK setup guides (Next.js, Express, etc.)
- `/api-keys` → API key management for SDK integration
- `/settings` → Account, project, and billing settings

---

## Navigation

- **Landing Page**: Minimal top navbar with links to features, pricing, and auth.
- **Dashboard**: Sidebar navigation for quick access to Live Logs, Alerts, Integrations, and Settings. Top bar with project selection and user profile.

---

## Core User Flow

### 1. Onboarding
- User signs up and signs in via the landing page.
- User is directed to the dashboard.
- User creates a project and gets an API key from the **API Keys** page.

### 2. Integration
- User follows the guide in **Integrations** to install the Flash Logs SDK (e.g., `npm install @flashlogs/next`).
- User initializes the logger with their API key.
- User starts sending logs from their application code (e.g., `log.info("User logged in")`).

### 3. Monitoring
- User views the **Live Logs** page to see logs streaming in real-time.
- User uses the query bar to search and filter logs instantly.
- User checks the **Dashboard** for high-level metrics like ingest rate, error trends, and latency.

### 4. Alerting
- User goes to the **Alerts** page to define conditions (e.g., "Error rate > 5%").
- User configures a webhook URL to receive notifications when alerts are triggered.

---

## Data Architecture

### Ingestion Pipeline
- Logs are sent via the SDK to an ingestion API.
- The pipeline handles high-volume ingestion (2M+ logs/min) using an event-driven architecture.
- Logs are stored in a high-performance database optimized for time-series and search (e.g., ClickHouse or similar).

### Real-time Streaming
- Server-Sent Events (SSE) are used to push logs from the backend to the dashboard's Live Logs view.

---

## Features In Scope

- **High-speed Ingestion**: Capability to handle millions of logs per minute.
- **Real-time Streaming**: Instant log visibility without page refreshes.
- **Instant Search**: Powerful querying with sub-50ms average search time.
- **Smart Alerts**: Customizable alert rules with webhook notifications.
- **Easy SDKs**: Zero-config SDKs for popular frameworks (Next.js, Express, NestJS).
- **Dashboard Analytics**: Visualizations of log volume, error rates, and system health.
- **Multi-project Support**: Manage logs for multiple applications under one account.

---

## Features Out of Scope

- **Advanced Tracing**: Distributed tracing across microservices (focused on logs first).
- **Metric Collection**: Generic infrastructure metrics (CPU, RAM) - focused on application logs.
- **On-premise Hosting**: SaaS-only offering.
- **Deep Log Retention**: Extremely long-term archival (focused on active monitoring).

---

## Internal Tracking

Analytics are powered directly by ClickHouse queries to provide real-time dashboard stats without third-party tracking overhead. Key metrics tracked:
- Project Creation
- Log Ingestion Rate
- Error Distribution
- Alert Triggers

---

## Target User

- **Indie Hackers & Solo Devs**: Who need quick setup for side projects.
- **Early-stage Startups**: Shipping fast and needing reliable monitoring without the "enterprise" cost/complexity.
- **Junior Developers**: Who find traditional logging stacks (ELK, etc.) overwhelming.

---

## Success Criteria

- User can set up the SDK and see their first log in under 60 seconds.
- Live logs stream with less than 100ms delay.
- Search results return in under 50ms for large datasets.
- Dashboard provides an immediate clear picture of application health.
- Alerts reliably fire and send webhooks within seconds of the event.
