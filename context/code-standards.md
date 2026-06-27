# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap agent operations in try/catch, log failures, never let one failure crash everything

---

## TypeScript

- Strict mode enabled in tsconfig.json — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Next.js 16 Conventions

- App Router only — no Pages Router
- React 19 — use React 19 APIs throughout
- All components are Server Components by default
- Only add `"use client"` when the component requires:
  - useState or useReducer
  - useEffect
  - Browser APIs
  - Event listeners
  - Third party client-only libraries
- Never add `"use client"` to layout files unless absolutely required
- Data fetching happens in Server Components — never fetch in Client Components directly
- Route handlers live in `app/api/` — never put business logic directly in route handlers
- Server Actions live in `actions/` — never define Server Actions inline in components
- Caching is uncached by default — all dynamic code runs at request time
- Always read Next.js documentation before implementing any Next.js specific feature — APIs may differ from training data

---

## File and Folder Naming

- Folders: kebab-case — `live-logs`, `api-keys`
- Component files: PascalCase — `LogTable.tsx`, `StatCard.tsx`
- Utility files: camelCase — `clickhouse.ts`, `pusher-client.ts`
- Type files: camelCase — `index.ts`
- API route files: always `route.ts`
- Server Action files: camelCase — `auth.ts`, `projects.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { StatCard } from "@/components/dashboard/StatCard";

// 3. Type definitions
type Props = {
  projectId: string;
  onRefresh: () => void;
};

// 4. Component
export function ComponentName({ projectId, onRefresh }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes using CSS variables from ui-tokens.md

---

## API Route Handlers

```typescript
// app/api/logs/ingest/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate body
    // call ingestion service
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[logs/ingest]", error);
    return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
    );
  }
}
```

- Every route handler has a try/catch
- Every route handler validates the request body before processing
- Errors are logged with the route path as prefix: `[logs/ingest]`
- Always return `{ success: boolean, data?: T, error?: string }`
- Never return raw data without the success wrapper

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[component/function name]`
- User-facing errors must be human readable — never expose raw error messages
- API route errors return `status: 500` with generic message — never expose internals

---

## Environment Variables

All environment variables defined in `.env.local` for Next.js apps and `.env` for NestJS services. Never hardcode any key, URL, or secret anywhere in the codebase.

### Next.js Apps (`apps/`)

| Variable                            | Used In                    |
| ----------------------------------- | -------------------------- |
| `NEXT_PUBLIC_APP_URL`               | lib/utils.ts               |
| `CLICKHOUSE_HOST`                   | lib/clickhouse.ts          |
| `CLICKHOUSE_USER`                   | lib/clickhouse.ts          |
| `CLICKHOUSE_PASSWORD`               | lib/clickhouse.ts          |
| `NATS_URL`                          | lib/nats.ts                |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk middleware            |
| `CLERK_SECRET_KEY`                  | Clerk middleware            |
| `LOG_LEVEL`                         | Global                     |

### NestJS Services (`services/`)

| Variable          | Used In                                   |
| ----------------- | ----------------------------------------- |
| `DATABASE_URL`    | `src/database/database.module.ts` (Neon)  |
| `REDIS_HOST`      | `src/infra/redis.module.ts`               |
| `REDIS_PORT`      | `src/infra/redis.module.ts`               |
| `REDIS_PASSWORD`  | `src/infra/redis.module.ts`               |
| `REDIS_DB`        | `src/infra/redis.module.ts` (default: 0)  |
| `REDIS_KEY_SECRET`| `src/utils/key-digest.ts` (SHA-256 HMAC)  |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.

`REDIS_KEY_SECRET` must be generated with `openssl rand -hex 32` and kept strictly server-side. It is used to HMAC-digest API key IDs before they are stored as Redis cache keys.

---

## Import Aliases

Always use the `@/` alias — never use relative imports that go up more than one level.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { log } from "@/lib/logger";

// Never
import { Button } from "../../../components/ui/button";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does shadcn/ui already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

### Approved dependencies — Next.js apps (`apps/`)

- `lucide-react` — Icons
- `tailwindcss` — Styling
- `shadcn/ui` components — UI primitives
- `zod` — Schema validation
- `framer-motion` — Animations
- `nats.js` — NATS client
- `date-fns` — Date formatting (use this, not `timeago.js`)
- `@clerk/nextjs` — Authentication

### Approved dependencies — NestJS services (`services/`)

- `drizzle-orm` — ORM for Neon PostgreSQL
- `drizzle-kit` — Drizzle schema generation and migrations (dev dependency)
- `@neondatabase/serverless` — Neon serverless PostgreSQL client
- `ioredis` — Redis client
- `lru-cache` — In-process LRU cache for the first validation layer
- `argon2` — API key hashing (Argon2id algorithm)
- `class-validator` — NestJS validation pipe support
- `class-transformer` — NestJS transform pipe support
- `ws` — WebSocket dependency required by `@neondatabase/serverless` in Node.js

Do not install any other packages without updating this list first.