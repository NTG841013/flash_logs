import { LogType, LogTrack, LogSecurity, LogMetrics, Importance, Subsystem } from "./index.js";

export interface LogTimestamps {
    event_time: string;
    ingest_time?: string;
}

export interface LogMessage {
    type: LogType;
    message: string;
    importance: Importance;
    subsystem: Subsystem;
    operation?: string;
    track: LogTrack;
    security: LogSecurity;
    metrics: LogMetrics;
    timestamps: LogTimestamps;
}
