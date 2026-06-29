import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import * as nats from 'nats';
import { NATS_CLIENT } from '../../infra/constants';
import { ClickhouseService } from '../../clickhouse/client';

@Injectable()
export class LogWorker implements OnModuleInit, OnModuleDestroy {
  private jc = nats.JSONCodec();
  private subscription: nats.Subscription | null = null;
  private batch: any[] = [];
  private batchInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 1000;
  private readonly BATCH_TIME_MS = 5000;

  constructor(
    @Inject(NATS_CLIENT) private readonly natsConnection: nats.NatsConnection | null,
    private readonly clickhouseService: ClickhouseService
  ) {}

  async onModuleInit() {
    this.tryInitialize();
  }

  private async tryInitialize() {
    if (!this.natsConnection) {
      console.warn('[LogWorker] NATS client not available, waiting 10s to retry...');
      setTimeout(() => this.tryInitialize(), 10000);
      return;
    }

    try {
      // Subscribe to all logs
      this.subscription = this.natsConnection.subscribe('logs.>', {
        callback: (err, msg) => {
          if (err) {
            console.error('[LogWorker] NATS subscription error:', err);
            return;
          }
          this.handleMessage(msg);
        },
      });

      // Start batching timer
      this.batchInterval = setInterval(() => this.flushBatch(), this.BATCH_TIME_MS);

      console.log('[LogWorker] Started and subscribed to logs.>');
    } catch (err) {
      console.error('[LogWorker] Failed to start, retrying in 10s:', err);
      setTimeout(() => this.tryInitialize(), 10000);
    }
  }

  private handleMessage(msg: nats.Msg) {
    try {
      const log = this.jc.decode(msg.data);
      this.batch.push(log);

      if (this.batch.length >= this.BATCH_SIZE) {
        this.flushBatch();
      }
    } catch (err) {
      console.error('[LogWorker] Failed to decode message:', err);
    }
  }

  private async flushBatch() {
    if (this.batch.length === 0) return;

    const logsToInsert = [...this.batch];
    this.batch = [];

    try {
      await this.clickhouseService.insertLogs(logsToInsert);
      console.log(`[LogWorker] Flushed ${logsToInsert.length} logs to ClickHouse`);
    } catch (err) {
      console.error('[LogWorker] Failed to flush batch to ClickHouse:', err);
      // Optional: Re-queue logs or send to a Dead Letter Queue
    }
  }

  onModuleDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
    // Flush remaining logs
    this.flushBatch();
  }
}
