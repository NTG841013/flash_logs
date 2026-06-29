import { ClickHouseClient } from '@clickhouse/client';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CLICKHOUSE_CLIENT } from '../infra/constants';
import { createLogsTable } from './schema';

@Injectable()
export class ClickhouseService implements OnModuleInit {
  private isInitialized = false;

  constructor(
    @Inject(CLICKHOUSE_CLIENT) private readonly client: ClickHouseClient | null
  ) {}

  async onModuleInit() {
    this.tryInitializeSchema();
  }

  private async tryInitializeSchema() {
    if (!this.client || this.isInitialized) return;

    try {
      await createLogsTable(this.client);
      this.isInitialized = true;
      console.log('ClickHouse schema initialized');
    } catch (err) {
      console.error('Failed to initialize ClickHouse schema, retrying in 10s:', err.message);
      setTimeout(() => this.tryInitializeSchema(), 10000);
    }
  }

  async insertLogs(logs: any[]) {
    if (!this.client || logs.length === 0) return;
    if (!this.isInitialized) {
      console.warn('[ClickhouseService] Not initialized, dropping logs or re-initialize triggered');
      this.tryInitializeSchema();
      return;
    }

    try {
      await this.client.insert({
        table: 'logs',
        values: logs.map(log => ({
          ...log,
          metadata: typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : (log.metadata || '{}'),
        })),
        format: 'JSONEachRow',
      });
    } catch (err) {
      console.error('Failed to insert logs into ClickHouse:', err);
      throw err;
    }
  }

  async queryLogs(projectId: string, limit = 100) {
    if (!this.client) return [];

    try {
      const resultSet = await this.client.query({
        query: `
          SELECT * FROM logs 
          WHERE projectId = {projectId:String} 
          ORDER BY timestamp DESC 
          LIMIT {limit:UInt32}
        `,
        query_params: { projectId, limit },
        format: 'JSONEachRow',
      });
      return await resultSet.json();
    } catch (err) {
      console.error('Failed to query logs from ClickHouse:', err);
      return [];
    }
  }
}
