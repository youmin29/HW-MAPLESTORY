import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  // swagger
  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API 문서입니다.')
        .setVersion('1.0.0')
        .build(),
    ),
  );

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
