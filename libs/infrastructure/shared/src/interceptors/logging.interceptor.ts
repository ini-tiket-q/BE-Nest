import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { method, url, correlationId } = request;

    console.log(`[${correlationId}] → ${method} ${url}`);

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          console.log(`[${correlationId}] ← ${method} ${url} (${duration}ms)`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error(
            `[${correlationId}] ✖ ${method} ${url} (${duration}ms)`,
            error?.message
          );
        },
      })
    );
  }
}
