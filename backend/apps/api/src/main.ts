import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { GlobalHttpExceptionFilter } from '@backend/common/filters/http-exception.filter';
import { ResponseEnvelopeInterceptor } from '@backend/common/interceptors/response-envelope.interceptor';
import { AppModule } from './app.module';

const DEFAULT_CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'] as const;

function resolveCorsOrigin(): string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) {
    return [...DEFAULT_CORS_ORIGINS];
  }

  const origins = raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return origins.length > 0 ? origins : [...DEFAULT_CORS_ORIGINS];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: resolveCorsOrigin(),
      credentials: true,
    },
  });
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
}

void bootstrap();
