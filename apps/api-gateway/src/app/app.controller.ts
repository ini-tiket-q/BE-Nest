import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IdempotencyInterceptor } from '@tiketq-be/shared';

@UseInterceptors(IdempotencyInterceptor)
@Controller()
export class AppController {
  @Get()
  getData(): string {
    return 'hello world';
  }
}
