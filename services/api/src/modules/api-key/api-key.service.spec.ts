import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { DatabaseModule } from '../../database/database.module';
import { RedisModule } from '../../infra/redis.module';
import { CacheModule } from '../../infra/cache.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../../configs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

describe('ApiKeyService (Integration)', () => {
  let service: ApiKeyService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        DatabaseModule,
        RedisModule,
        CacheModule,
      ],
      providers: [ApiKeyService],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an API key in Neon', async () => {
    const userId = 'test_user_' + Date.now();
    const result = await service.create(userId);

    expect(result).toBeDefined();
    expect(result.key).toContain('OML_');
    expect(result.userId).toBe(userId);
    console.log('Created API Key:', result.key);
    console.log('ID:', result.id);
  });

  it('should list API keys for a user', async () => {
    const userId = 'test_user_list_' + Date.now();
    await service.create(userId);
    const keys = await service.list(userId);

    expect(keys.length).toBeGreaterThan(0);
    expect(keys[0].userId).toBe(userId);
  });

  it('should validate a key (cache-backed)', async () => {
    const userId = 'test_user_val_' + Date.now();
    const { key } = await service.create(userId);
    console.log('Testing Validation with Key:', key);

    // First call: DB miss, populate cache
    const result1 = await service.validateKey(key);
    expect(result1.userId).toBe(userId);

    // Second call: LRU hit
    const result2 = await service.validateKey(key);
    expect(result2.userId).toBe(userId);
  });

  it('should enforce 5-key limit', async () => {
    const userId = 'limit_test_user_' + Date.now();
    // Create 5 keys
    for (let i = 0; i < 5; i++) {
      await service.create(userId);
    }
    // Attempt 6th key
    await expect(service.create(userId)).rejects.toThrow('Limit of 5 API keys reached');
  });
});
