import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProcessPaymentCallbackUseCase {
  private readonly logger = new Logger(ProcessPaymentCallbackUseCase.name);
  constructor() {}

  async execute(callbackPayload: any): Promise<{ message: string }> {
    this.logger.log(
      `Processing payment callback for order ID: ${callbackPayload.order_id}`
    );
    // Add your business logic here to process the payment callback

    return { message: 'this is works right!' };
  }
}
