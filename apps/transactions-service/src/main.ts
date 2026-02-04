/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// ⚠️ IMPORTANT:
// Import tracing BEFORE any NestJS modules so OpenTelemetry can
// auto-instrument HTTP/Express and other libraries correctly.
import { TraceIdLoggingInterceptor } from './tracing';

// Now we can safely import NestJS modules
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Log the OpenTelemetry trace ID for every incoming request.
  app.useGlobalInterceptors(new TraceIdLoggingInterceptor());

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Transaction Service API')
    .setDescription('API for managing flight booking transactions')
    .setVersion('1.0')
    .addTag('transactions', 'Transaction management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📚 Swagger UI available at: http://localhost:${port}/api/docs`);
}

bootstrap();
