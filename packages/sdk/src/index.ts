import { createLogger } from "./core/index.js";
import { OMLTransport } from "./utils/index.js";
import { LoggerConfig, LogPayload, LogLevel } from "./types/index.js";

export { createLogger, OMLTransport };
export type { LoggerConfig, LogPayload, LogLevel };

// Compatibility layer for the old FlashLogs class
export interface FlashLogsConfig {
    apiKey: string;
    projectId: string; // Map this to appName or similar in the new system
    endpoint?: string;
    source?: string;
}

export interface LogEvent {
    message: string;
    level?: LogLevel;
    projectId: string;
    metadata?: Record<string, unknown>;
    timestamp?: string;
    source?: string;
}

export class FlashLogs {
    private logger: ReturnType<typeof createLogger>;

    constructor(config: FlashLogsConfig) {
        if (!config.apiKey) throw new Error('[FlashLogs] API Key is required');
        if (!config.projectId) throw new Error('[FlashLogs] Project ID is required');

        this.logger = createLogger({
            apiKey: config.apiKey,
            appName: config.projectId,
            environment: typeof process !== 'undefined' ? process.env.NODE_ENV : 'development'
        });
    }

    async log(event: Omit<LogEvent, 'projectId'>): Promise<void> {
        const levelMap: Record<string, any> = {
            'info': 'info',
            'warn': 'warning',
            'error': 'error',
            'debug': 'debug'
        };

        await this.logger.send({
            type: levelMap[event.level || 'info'] || 'info',
            message: event.message,
            operation: event.source,
            metrics: event.metadata as any,
            timestamps: event.timestamp ? { event_time: event.timestamp } : undefined
        });
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
