import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization, x-user-id, x-api-key, cache-control',
      exposedHeaders: 'Authorization',
    });
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 8080;
    console.log(`[BOOTSTRAP] Attempting to start on port: ${port}`);
    
    await app.listen(port, '0.0.0.0');
    console.log(`[BOOTSTRAP] Application is running on: http://localhost:${port}/api/v1`);
  } catch (error) {
    console.error(`[BOOTSTRAP] Fatal error during startup:`, error);
    process.exit(1);
  }
}
bootstrap();
