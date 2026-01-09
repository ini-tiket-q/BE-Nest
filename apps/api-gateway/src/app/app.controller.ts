import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getData(): string {
    return 'hello world';
  }
}