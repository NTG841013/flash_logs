import type { Request, Response, NextFunction } from 'express';
import { FlashLogs, type FlashLogsConfig } from '../index.js';

export function flashLogsExpress(config: FlashLogsConfig) {
  const logger = new FlashLogs({
    ...config,
    source: config.source || 'express',
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Attach logger to request for convenience
    // @ts-ignore
    req.flashLogs = logger;

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    });

    next();
  };
}
