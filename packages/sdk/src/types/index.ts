import { LogTimestamps } from "./log.js";
import { LogTrack } from "./track.js";
import { LogSecurity } from "./security.js";
import { LogMetrics } from "./metrics.js";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LoggerConfig {
    apiKey: string;
    appName?: string;
    environment?: string;
}

export interface LogPayload {
    type: LogType;
    message: string;
    importance?: Importance;
    subsystem?: Subsystem;
    operation?: string;
    track?: LogTrack;
    security?: LogSecurity;
    metrics?: LogMetrics;
    service?: string;
    timestamps?: LogTimestamps;
    ingested_at?: number;
    appName?: string;
    environment?: string;
}

export type LogType = "error" | "warning" | "info" | "audit" | "metric" | "debug" | "success";

export type Importance = "critical" | "high" | "medium" | "low";

export type Subsystem = "db" | "cache" | "queue" | "network";

export type UserRole = "super-admin" | "admin" | "user";

export type AuthStatus = "success" | "failed" | "expired";

export * from "./log.js";
export * from "./metrics.js";
export * from "./security.js";
export * from "./track.js";