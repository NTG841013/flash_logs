import { Module } from '@nestjs/common';
import { LogWorker } from './log.worker';
import { ClickhouseService } from '../../clickhouse/client';

@Module({
  providers: [LogWorker],
  exports: [LogWorker],
})
export class WorkersModule {}
