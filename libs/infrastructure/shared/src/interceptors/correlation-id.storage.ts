import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationIdStore {
  correlationId: string;
}

export const correlationIdStorage = new AsyncLocalStorage<CorrelationIdStore>();

export function getCorrelationId(): string | undefined {
  return correlationIdStorage.getStore()?.correlationId;
}
