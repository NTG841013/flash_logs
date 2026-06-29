import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, NatsConnection } from 'nats';

import { NATS_CLIENT } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: NATS_CLIENT,
      useFactory: async (configService: ConfigService): Promise<NatsConnection | null> => {
        const servers = configService.get('NATS_URL', 'nats://localhost:4222');
        try {
          const nc = await connect({
            servers,
            name: 'flash-logs-api',
            waitOnFirstConnect: false,
            reconnect: true,
            maxReconnectAttempts: -1,
          });
          console.log(`NATS client initialized for ${servers}`);
          return nc;
        } catch (err) {
          console.error(`[CRITICAL] NATS failed to initialize: ${err.message}. App will continue but NATS features will be disabled.`);
          return null; // Return null instead of throwing to let Nest boot
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [NATS_CLIENT],
})
export class NatsModule {}
