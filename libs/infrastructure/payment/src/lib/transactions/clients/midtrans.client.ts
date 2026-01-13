import { BadRequestException, Injectable } from "@nestjs/common";

const midtransClient = require('midtrans-client');
interface TransactionDetailItf {
    transaction_details: {
        order_id: string;
        gross_amount: number;
    }
}
interface SnapItf {
    createTransaction(parameter: TransactionDetailItf): Promise<{ token: string, redirect_url: string }>;
}

@Injectable()
export class MidtransClient {
    private readonly snap: SnapItf
    constructor() {
        const serverKey = process.env['SERVER_KEY'];
        const clientKey = process.env['CLIENT_KEY'];
        if (!serverKey) throw new BadRequestException('SERVER_CLIENT is undefined');
        if (!clientKey) throw new BadRequestException('CLIENT_KEY is undefined');

        this.snap = new midtransClient.Snap({
            isProduction : false,
            serverKey : serverKey,
            clientKey : clientKey
        })
    }

    async generateSnapUrl(params: {orderId: string, grossAmount: number}): Promise<string> {
        const {orderId, grossAmount} = params
        let parameter: TransactionDetailItf = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            }
        };
        const transaction: { token: string, redirect_url: string } = await this.snap.createTransaction(parameter)
        const redirectUrl: string = transaction.redirect_url
        return redirectUrl
    }
}