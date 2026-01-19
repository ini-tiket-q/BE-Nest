import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  use(req: any, res: any, next: (error?: any) => void): any {
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) || uuidv4();

    this.logger.log(
      `Incoming request [${req.method} ${req.url}] - correlationId: ${correlationId}`
    );

    req.correlationId = correlationId;
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
