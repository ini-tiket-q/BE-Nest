import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { IdempotencyInterceptor } from '@tiketq-be/shared';

@UseInterceptors(IdempotencyInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
