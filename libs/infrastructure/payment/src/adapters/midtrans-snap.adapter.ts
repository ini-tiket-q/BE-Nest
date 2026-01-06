import { Injectable } from "@nestjs/common";
import { MidtransGenerateRequestDto } from "../dtos/req/midtrans-generate-request.dto";
import { IMidtransPaymentPort } from '../../../../domain/src/transaction/ports';
import { PaymentParams } from "../../../../domain/transactions/models";
import { MidtransClient } from "../lib/transactions/clients/midtrans.client";
import { MidtransGenerateResponseDto } from "../dtos/res/midtrans-generate-response.dto";

@Injectable()
export class MidtransSnapAdapter implements IMidtransPaymentPort {
    constructor(private readonly midtransClient: MidtransClient) {}
    async generateSnapUrl (params: PaymentParams): Promise<MidtransGenerateResponseDto> {
        const transaction: MidtransGenerateRequestDto = params
        const path = `https://app.sandbox.midtrans.com/snap/v1/transactions`
        const generate: MidtransGenerateResponseDto = await this.midtransClient.reqMidtrans<MidtransGenerateResponseDto, MidtransGenerateRequestDto>(path, transaction);
        return generate
    }
}