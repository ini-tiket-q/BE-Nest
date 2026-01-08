import { BadRequestException, Injectable } from "@nestjs/common";
@Injectable()
export class MidtransClient {
    private readonly serverKey = process.env['SERVER_KEY'];
    constructor() {
        if (!this.serverKey) throw new BadRequestException('SERVER_KEY is undefined');
    }

    async reqMidtrans<T, U>(path: string, params: U): Promise<T> {
        const encodedServerKey = Buffer.from(`${this.serverKey}:`, 'utf8').toString('base64')
        const response = await fetch(path, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${encodedServerKey}`
            },
            body: JSON.stringify(params)
        });
        if(!response.ok) throw new BadRequestException(`Midtrans error: ${response.status}`);
        const data: T = await response.json()
        return data
    }
}