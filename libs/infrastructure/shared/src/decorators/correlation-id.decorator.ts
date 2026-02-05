import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { correlationIdStorage } from '../middleware/correlation-id.storage';

export const CorrelationId = createParamDecorator(
  (_data: unknown, _ctx: ExecutionContext): string | undefined => {
    const store = correlationIdStorage.getStore();
    return store?.correlationId;
  }
);
