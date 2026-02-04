import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { hashRequestBody } from '../utils/idempotency.utils';

export interface IdempotencyCacheValue {
  bodyHash: string;
  response: any;
}

export const IDEMPOTENCY_HEADER = 'idempotency-key';
export const IDEMPOTENCY_PREFIX = 'idempotency';
export const IDEMPOTENCY_BODY_PREFIX = 'idempotency:body';
export const IDEMPOTENCY_TTL = 1000 * 60 * 5; // 5 minutes
export const IDEMPOTENCY_LOCK_TTL = 1000 * 60; // 60 seconds

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @Inject('CACHE_MANAGER')
    private readonly cache: Cache
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey =
      (request.headers['x-idempotency-key'] as string) ??
      (request.headers['X-Idempotency-Key'] as string);

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    const bodyHash = hashRequestBody(request.body);

    const keyCacheKey = `${IDEMPOTENCY_PREFIX}:${idempotencyKey}`;
    const bodyCacheKey = `${IDEMPOTENCY_BODY_PREFIX}:${bodyHash}`;
    const lockKey = `${keyCacheKey}:lock`;

    const existingKeyForBody = await this.cache.get<string>(bodyCacheKey);

    if (existingKeyForBody && existingKeyForBody !== idempotencyKey) {
      throw new ConflictException(
        'Same request payload was already processed with a different Idempotency-Key'
      );
    }

    const cached = await this.cache.get<IdempotencyCacheValue>(keyCacheKey);

    if (cached) {
      if (cached.bodyHash !== bodyHash) {
        throw new ConflictException(
          'Idempotency-Key already used with different request body'
        );
      }

      return from(Promise.resolve(cached.response));
    }

    const lockExists = await this.cache.get(lockKey);
    if (lockExists) {
      throw new ConflictException(
        'Request with this Idempotency-Key is already being processed'
      );
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cache.set(
          keyCacheKey,
          {
            bodyHash,
            response,
          },
          IDEMPOTENCY_TTL
        );

        await this.cache.set(bodyCacheKey, idempotencyKey, IDEMPOTENCY_TTL);
      })
    );
  }
}
