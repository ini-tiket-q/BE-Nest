import { SetMetadata, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { InternalApiGuard } from '../guards/internal-api.guard';

export const INTERNAL_KEY = 'isInternal';

export function Internal() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UseGuards(InternalApiGuard)(target, propertyKey, descriptor);
    ApiSecurity('internal-api-key')(target, propertyKey, descriptor);
    SetMetadata(INTERNAL_KEY, true)(target, propertyKey, descriptor);
  };
}
