import { ClickHouseClient } from '@clickhouse/client';
import { OnModuleInit } from '@nestjs/common';
export declare class ClickhouseService implements OnModuleInit {
    private readonly client;
    private isInitialized;
    constructor(client: ClickHouseClient | null);
    onModuleInit(): Promise<void>;
    private tryInitializeSchema;
    insertLogs(logs: any[]): Promise<void>;
    queryLogs(projectId: string, limit?: number): Promise<unknown[]>;
}
