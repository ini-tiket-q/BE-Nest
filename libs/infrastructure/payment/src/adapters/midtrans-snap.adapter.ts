import { BadRequestException, Injectable } from "@nestjs/common";
import { MidtransRequestDto } from "../dtos/midtrans-request.dto";

@Injectable()
export class MidtransSnapTransaction {
    private readonly server_key = process.env['SERVER_KEY'];
    constructor() {
        if (!this.server_key) throw new BadRequestException('SERVER_CLIENT is undefined');
    }
    async generateSnap (orderId: string, grossAmount: number): Promise<{ token: string, redirect_url: string }> {
        const encodedServerKey = Buffer.from(`${this.server_key}:`, 'utf8').toString('base64')
        const transaction: MidtransRequestDto = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            }
        }
        const response = await fetch(`https://app.sandbox.midtrans.com/snap/v1/transactions`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${encodedServerKey}`
            },
            body: JSON.stringify(transaction)
        });
        if(!response.ok) throw new BadRequestException(`Midtrans error: ${response.status}`);
        const dataGenerate: { token: string, redirect_url: string } = await response.json()
        return dataGenerate
    }
}