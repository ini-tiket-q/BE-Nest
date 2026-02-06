import './tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Proxy configuration
  const services = [
    {
      route: '/api/flights',
      target: 'http://flight-service:3334',
    },
    {
      route: '/api/transactions',
      target: 'http://transactions-service:3001',
    },
  ];

  // Apply proxy middleware
  services.forEach(({ route, target }) => {
    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^${route}`]: '', // rewrite path
        },
      })
    );
  });

  await app.listen(port);
  Logger.log(`🚀 API Gateway is running on: http://localhost:${port}`);
}
bootstrap();
