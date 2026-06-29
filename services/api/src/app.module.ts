import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configs';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './infra/redis.module';
import { CacheModule } from './infra/cache.module';
import { NatsModule } from './infra/nats.module';
import { ClickhouseModule } from './infra/clickhouse.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './controllers/app.service';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { WorkersModule } from './modules/workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '../.env'],
    }),
    DatabaseModule,
    RedisModule,
    CacheModule,
    NatsModule,
    ClickhouseModule,
    ApiKeyModule,
    IngestionModule,
    WorkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
