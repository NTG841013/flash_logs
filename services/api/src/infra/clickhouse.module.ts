import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import { ClickhouseService } from '../clickhouse/client';

import { CLICKHOUSE_CLIENT } from './constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CLICKHOUSE_CLIENT,
      useFactory: (configService: ConfigService): ClickHouseClient | null => {
        try {
          const url = configService.get('CLICKHOUSE_URL', 'http://localhost:8123');
          const username = configService.get('CLICKHOUSE_USER', 'default');
          const password = configService.get('CLICKHOUSE_PASSWORD', 'flash');
          const database = configService.get('CLICKHOUSE_DATABASE', 'flash');

          const client = createClient({
            url,
            username,
            password,
            database,
            clickhouse_settings: {
              date_time_input_format: 'best_effort',
            },
          });

          console.log(`ClickHouse client initialized for ${url}`);
          return client;
        } catch (err) {
          console.error(`[CRITICAL] ClickHouse failed to initialize: ${err.message}. App will continue but logging storage will be disabled.`);
          return null;
        }
      },
      inject: [ConfigService],
    },
    ClickhouseService,
  ],
  exports: [CLICKHOUSE_CLIENT, ClickhouseService],
})
export class ClickhouseModule {}
