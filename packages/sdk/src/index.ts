export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEvent {
  message: string;
  level?: LogLevel;
  projectId: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  source?: string;
}

export interface FlashLogsConfig {
  apiKey: string;
  projectId: string;
  endpoint?: string;
  source?: string;
}

export class FlashLogs {
  private readonly apiKey: string;
  private readonly endpoint: string;
  private readonly projectId: string;
  private readonly source?: string;

  constructor(config: FlashLogsConfig) {
    if (!config.apiKey) throw new Error('[FlashLogs] API Key is required');
    if (!config.projectId) throw new Error('[FlashLogs] Project ID is required');

    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.endpoint = config.endpoint || 'https://api.flashlogs.com/v1/logs/ingest';
    this.source = config.source;
  }

  async log(event: Omit<LogEvent, 'projectId'>): Promise<void> {
    try {
      const payload: LogEvent = {
        ...event,
        projectId: this.projectId,
        timestamp: event.timestamp || new Date().toISOString(),
        level: event.level || 'info',
        source: event.source || this.source || 'nodejs-sdk',
      };

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[FlashLogs] Ingestion failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('[FlashLogs] Network error:', error instanceof Error ? error.message : error);
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    return this.log({ message, level: 'info', metadata });
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    return this.log({ message, level: 'warn', metadata });
  }

  error(message: string, metadata?: Record<string, unknown>) {
    return this.log({ message, level: 'error', metadata });
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    return this.log({ message, level: 'debug', metadata });
  }
}

/**
 * Singleton instance helper
 */
let instance: FlashLogs | null = null;

export function init(config: FlashLogsConfig): FlashLogs {
  instance = new FlashLogs(config);
  return instance;
}

export function logger(): FlashLogs {
  if (!instance) {
    throw new Error('[FlashLogs] SDK not initialized. Call init() first.');
  }
  return instance;
}
