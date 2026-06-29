"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.enableVersioning({
            type: common_1.VersioningType.URI,
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
    }
    catch (error) {
        console.error(`[BOOTSTRAP] Fatal error during startup:`, error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map