import { ClickHouseClient } from '@clickhouse/client';

export const createLogsTable = async (clickhouse: ClickHouseClient) => {
    await clickhouse.command({
        query: `
      CREATE TABLE IF NOT EXISTS logs (
        id UUID DEFAULT generateUUIDv4(),
        timestamp DateTime64(3, 'UTC') DEFAULT now(),
        level String,
        message String,
        projectId String,
        userId String,
        apiKeyId String,
        metadata String,
        created_at DateTime DEFAULT now()
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (projectId, timestamp, level)
      TTL toDateTime(timestamp) + INTERVAL 30 DAY DELETE
      SETTINGS index_granularity = 8192;
    `
    });
}

