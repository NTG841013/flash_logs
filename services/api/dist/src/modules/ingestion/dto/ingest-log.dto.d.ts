export declare enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}
export declare class IngestLogDto {
    message: string;
    level?: LogLevel;
    projectId: string;
    metadata?: Record<string, any>;
    timestamp?: string;
}
