import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Event API Documentation')
        .setDescription('Event API 문서입니다.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build(),
    ),
  );

  await app.listen(process.env.port ?? 3002);
}
bootstrap();
