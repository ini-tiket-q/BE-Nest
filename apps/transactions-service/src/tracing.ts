// Simple tracing bootstrap for the Transactions Service.
// This keeps the OpenTelemetry setup in one place and can be reused in tests/CLI later.

import { Logger } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { initializeTracing } from '@tiketq-be/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Initialize the OpenTelemetry SDK as soon as this module is loaded.
// IMPORTANT: `tracing.ts` must be imported BEFORE any Nest modules in `main.ts`.
initializeTracing('transactions-service', '1.0.0');

/**
 * Logs the current Trace ID for every incoming HTTP request.
 *
 * This helps correlate application logs with Jaeger traces.
 */
@Injectable()
export class TraceIdLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TraceIdLoggingInterceptor.name);

  intercept(contextHost: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = contextHost.switchToHttp();
    const request = httpContext.getRequest<Request>();

    const activeSpan = trace.getSpan(context.active());
    const traceId = activeSpan?.spanContext().traceId;

    if (traceId && request) {
      this.logger.log(
        `TraceId=${traceId} method=${request.method} url=${request.url}`,
      );

      // Optionally attach traceId to the request object for other consumers
      (request as any).traceId = traceId;
    }

    return next.handle().pipe(
      tap(() => {
        // You could also log completion or status codes here if desired.
      }),
    );
  }
}

