import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './configure-swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50kb' }));

  app.use(helmet());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? false
        : 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  configureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();