import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { correlationIdStorage } from '../middleware/correlation-id.storage';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    const store = correlationIdStorage.getStore();
    const correlationId = store?.correlationId;

    if (correlationId) {
      response.setHeader(CORRELATION_ID_HEADER, correlationId);
    }

    const request = httpContext.getRequest();
    const method = request.method;
    const url = request.originalUrl;

    console.log(`[${correlationId}] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[${correlationId}] Response sent`);
      })
    );
  }
}
