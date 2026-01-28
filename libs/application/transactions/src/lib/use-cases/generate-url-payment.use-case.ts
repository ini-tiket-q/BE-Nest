import { Inject, Injectable } from "@nestjs/common";
import { IMidtransPaymentPort } from "@tiketq-be/transactions_domain";
import { PaymentParams } from "libs/domain/transactions/models";

@Injectable()

export class CheckoutUseCase {
    constructor(@Inject('IMidtransPaymentPort') private readonly midtransSnapAdapter: IMidtransPaymentPort){}

    async execute (order_id: string, gross_amount: number): Promise<string> {
        const param: PaymentParams = {
            transaction_details: {
                order_id,
                gross_amount
            }
        };
        const generate = await this.midtransSnapAdapter.generateSnapUrl(param);
        return generate;
    }
}