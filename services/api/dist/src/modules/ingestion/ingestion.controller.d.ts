import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as nats from 'nats';
import { IngestLogDto } from './dto/ingest-log.dto';
import { ClickhouseService } from '../../clickhouse/client';
export declare class IngestionController {
    private readonly natsConnection;
    private readonly clickhouseService;
    private jc;
    constructor(natsConnection: nats.NatsConnection, clickhouseService: ClickhouseService);
    ingest(body: IngestLogDto, req: any): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    queryLogs(projectId: string, limit?: number): Promise<unknown[]>;
    streamLogs(projectId: string): Observable<MessageEvent>;
}
