import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { ApiKeyModule } from '../api-key/api-key.module';
import { ClickhouseService } from '../../clickhouse/client';

@Module({
  imports: [ApiKeyModule],
  controllers: [IngestionController],
  providers: [],
})
export class IngestionModule {}
