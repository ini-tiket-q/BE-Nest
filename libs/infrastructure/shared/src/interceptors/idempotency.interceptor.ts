import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { from, Observable, tap } from 'rxjs';

const IDEMPOTENCY_TTL_SECONDS = 60 * 5;

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest();
    const key =
      (req.headers['x-idempotency-key'] as string) ??
      (req.headers['X-Idempotency-Key'] as string);

    if (!key) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    const cacheKey = key;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return from([cached]);
    }

    return next.handle().pipe(
      tap((response) => {
        this.cacheManager.set(cacheKey, response, IDEMPOTENCY_TTL_SECONDS);
      })
    );
  }
}
