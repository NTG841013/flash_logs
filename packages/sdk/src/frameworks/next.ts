import { FlashLogs, type FlashLogsConfig } from '../index';

export function createNextLogger(config: FlashLogsConfig) {
  return new FlashLogs({
    ...config,
    source: config.source || 'nextjs',
  });
}

/**
 * Middleware helper to log requests
 */
export function withFlashLogs(config: FlashLogsConfig) {
  const logger = createNextLogger(config);

  return async (req: Request) => {
    const start = Date.now();
    const url = new URL(req.url);

    // Background log the request
    logger.info(`Request: ${req.method} ${url.pathname}`, {
      method: req.method,
      url: req.url,
      ua: req.headers.get('user-agent'),
    });

    return {
      logResponse: async (res: Response) => {
        const duration = Date.now() - start;
        logger.info(`Response: ${req.method} ${url.pathname} ${res.status}`, {
          status: res.status,
          duration: `${duration}ms`,
        });
      }
    };
  };
}
