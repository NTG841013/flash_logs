import { Controller, Sse, MessageEvent, Param, UseGuards, Request, Post, Body, Get, Query } from '@nestjs/common';
import { Observable, interval, map, fromEvent, merge } from 'rxjs';
import * as nats from 'nats';
import { Inject } from '@nestjs/common';
import { NATS_CLIENT } from '../../infra/constants';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { IngestLogDto } from './dto/ingest-log.dto';
import { ClickhouseService } from '../../clickhouse/client';

@Controller('logs')
export class IngestionController {
  private jc = nats.JSONCodec();

  constructor(
    @Inject(NATS_CLIENT) private readonly natsConnection: nats.NatsConnection,
    private readonly clickhouseService: ClickhouseService
  ) {}

  @Post('ingest')
  @UseGuards(ApiKeyGuard)
  async ingest(
    @Body() body: IngestLogDto,
    @Request() req: any
  ): Promise<{ success: boolean; messageId?: string }> {
    const { projectId, message, level, metadata, timestamp } = body;
    
    const logEvent = {
      message,
      level,
      projectId,
      metadata: metadata || {},
      timestamp: timestamp || new Date().toISOString(),
      userId: req.user.id,
      apiKeyId: req.apiKeyId,
    };

    if (this.natsConnection) {
      const subject = `logs.${projectId}.${level}`;
      this.natsConnection.publish(subject, this.jc.encode(logEvent));
    } else {
      console.warn('[Ingestion] NATS not available, log dropped or simulation only');
    }

    return { success: true };
  }

  @Get('query/:projectId')
  // TODO: Add AuthGuard
  async queryLogs(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: number
  ) {
    return this.clickhouseService.queryLogs(projectId, limit ? Number(limit) : 100);
  }

  @Sse('stream/:projectId')
  // TODO: Add ApiKeyGuard once projects are implemented
  streamLogs(@Param('projectId') projectId: string): Observable<MessageEvent> {
    console.log(`Starting log stream for project: ${projectId}`);
    
    // In a real scenario, we would subscribe to NATS subject for this project
    // For now, we'll simulate some logs if no NATS messages are coming in
    const subject = `logs.${projectId}.*`;
    
    // This is a simplified version. Usually, you'd use a Subject or similar to bridge NATS to RxJS
    return new Observable<MessageEvent>(observer => {
      if (!this.natsConnection) {
        observer.next({ data: { type: 'error', message: 'NATS not available' } } as MessageEvent);
        return;
      }

      const subscription = this.natsConnection.subscribe(subject, {
        callback: (err, msg) => {
          if (err) {
            console.error('NATS subscription error', err);
            return;
          }
          const data = this.jc.decode(msg.data);
          observer.next({
            data,
          } as MessageEvent);
        }
      });

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        observer.next({ data: { type: 'heartbeat' } } as MessageEvent);
      }, 15000);

      return () => {
        subscription.unsubscribe();
        clearInterval(heartbeat);
        console.log(`Stopped log stream for project: ${projectId}`);
      };
    });
  }
}
