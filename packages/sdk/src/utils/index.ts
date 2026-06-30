import { LoggerConfig, LogPayload } from "../types/index.js";
import { getEnvConfig } from "../configs/index.js";

export class OMLTransport {
    private baseUrl: string;
    private headers: Record<string, string>;
    private buffer: LogPayload[] = [];
    private timer: NodeJS.Timeout | null = null;
    private flushInterval = 2000;
    private shuttingDown = false;
    private isFlushing = false;

    constructor(config: LoggerConfig) {
        const envConfig = getEnvConfig();
        this.baseUrl = envConfig.baseUrl;

        this.headers = {
            "Content-Type": "application/json",
            "x-api-key": config.apiKey,
            ...(config.appName ? { "x-oml-app-name": config.appName } : {}),
            ...(config.environment ? { "x-oml-env": config.environment } : {}),
        };

        this.setupGracefulShutdown();
    }

    private setupGracefulShutdown() {
        const shutdownHandler = async (signal?: string) => {
            if (this.shuttingDown) return;
            this.shuttingDown = true;
            try {
                await this.flush();
            } catch (error) {
                console.error("[OMLTransport] Flush during shutdown failed:", error);
            } finally {
                if (signal !== "beforeExit") {
                    process.exit(0);
                }
            }
        };

        process.on("beforeExit", () => shutdownHandler("beforeExit"));
        process.on("SIGINT", () => shutdownHandler("SIGINT"));
        process.on("SIGTERM", () => shutdownHandler("SIGTERM"));
    }

    async send(payload: LogPayload) {
        if (this.shuttingDown) return;
        this.buffer.push({
            ...payload,
            ingested_at: Date.now(),
        });

        if (!this.timer) {
            this.timer = setTimeout(() => this.flush(), this.flushInterval);
        }
    }

    private async flush() {
        if (this.isFlushing) return;
        this.isFlushing = true;

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        const batch = this.buffer.splice(0, this.buffer.length);
        if (batch.length === 0) {
            this.isFlushing = false;
            return;
        }

        try {
            await fetch(`${this.baseUrl}/logs/ingest`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ logs: batch }),
                // keepalive: true, // Some environments don't support this
            });
        } catch (error) {
            console.error("[OMLTransport] Flush failed:", error);
        }
        this.isFlushing = false;
    }
}