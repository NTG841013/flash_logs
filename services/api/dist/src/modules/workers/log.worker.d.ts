import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as nats from 'nats';
import { ClickhouseService } from '../../clickhouse/client';
export declare class LogWorker implements OnModuleInit, OnModuleDestroy {
    private readonly natsConnection;
    private readonly clickhouseService;
    private jc;
    private subscription;
    private batch;
    private batchInterval;
    private readonly BATCH_SIZE;
    private readonly BATCH_TIME_MS;
    constructor(natsConnection: nats.NatsConnection | null, clickhouseService: ClickhouseService);
    onModuleInit(): Promise<void>;
    private tryInitialize;
    private handleMessage;
    private flushBatch;
    onModuleDestroy(): void;
}
