import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  private storage = new AsyncLocalStorage<{ correlationId: string }>();

  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const correlationId = this.storage.getStore()?.correlationId;

      if (correlationId && config.headers) {
        config.headers[CORRELATION_ID_HEADER] = correlationId;
      }

      return config;
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) || uuidv4();

    this.logger.log(
      `Incoming request [${req.method} ${req.url}] - correlationId: ${correlationId}`
    );

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // this.storage.run({ correlationId }, () => {
    //   next();
    // });
  }

  // Optional helper
  getCorrelationId(): string | undefined {
    return this.storage.getStore()?.correlationId;
  }
}
