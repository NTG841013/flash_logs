# @flashlogs/sdk

The official Flash Logs SDK for Node.js, Next.js, and Express.

## Installation

```bash
npm install @flashlogs/sdk
```

## Quick Start

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

- **Leveled Logging**: `info`, `warn`, `error`, `debug`.
- **Automatic Metadata**: Captures request details in middleware.
- **High Performance**: Lightweight and non-blocking.
- **Type Safe**: Written in TypeScript with full definition support.

## License

MIT
