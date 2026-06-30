# @flashlogs/sdk

The official Flash Logs SDK for Node.js, Next.js, and Express. The lightweight, high-performance logging SDK for Flash Logs. Real-time structured logging, automatic metadata capture, and sub-millisecond ingestion for Next.js, Express, and Node.js.

## Installation

```bash
npm install @flashlogs/sdk
```

## Quick Start (New API)

### Modular Logger

```typescript
import { createLogger } from '@flashlogs/sdk';

const logger = createLogger({
  apiKey: 'your_api_key',
  appName: 'my-app',
  environment: 'production'
});

await logger.info({
  message: 'User logged in',
  subsystem: 'auth',
  track: {
    user_id: 'user_123',
    role: 'admin'
  }
});
```

## Legacy API (Compatible)

### Basic Node.js Usage

```typescript
import { init, logger } from '@flashlogs/sdk';

init({
  apiKey: 'your_api_key',
  projectId: 'your_project_id'
});

const log = logger();

await log.info('Application started', { env: 'production' });
```

### Next.js Integration

```typescript
// middleware.ts
import { withFlashLogs } from '@flashlogs/sdk/next';

const config = {
  apiKey: process.env.FLASHLOGS_API_KEY!,
  projectId: process.env.FLASHLOGS_PROJECT_ID!
};

export default async function middleware(req: Request) {
  const { logResponse } = await withFlashLogs(config)(req);
  const res = NextResponse.next();
  await logResponse(res);
  return res;
}
```

### Express Integration

```typescript
import express from 'express';
import { flashLogsExpress } from '@flashlogs/sdk/express';

const app = express();

app.use(flashLogsExpress({
  apiKey: 'your_api_key',
  projectId: 'your_project_id'
}));

app.get('/', (req, res) => {
  res.send('Hello World');
});
```

## Features

- **Multi-Framework**: Native support for Next.js, Express, and Node.js.
- **Modern Standards**: Full ESM/CJS support with `NodeNext` compatibility.
- **Structured Logging**: Rich metadata support (Track, Security, Metrics, Subsystems).
- **Leveled Logging**: `info`, `warn`, `error`, `debug`, `success`, `audit`, `metric`.
- **Automatic Metadata**: Captures request details in middleware.
- **High Performance**: Batching transport with graceful shutdown handlers.
- **Type Safe**: Written in TypeScript with full definition support.

## License

ISC
