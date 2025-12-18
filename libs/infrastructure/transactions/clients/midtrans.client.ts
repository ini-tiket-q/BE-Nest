import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as midtransClient from 'midtrans-client';

@Injectable()
export class MidtransSnapClient {
    private snapClient: midtransClient.Snap;

    constructor() {
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const clientKey = process.env.MIDTRANS_CLIENT_KEY;

        if (!serverKey) {
            throw new InternalServerErrorException('MIDTRANS_SERVER_KEY is not defined in environment variables.');
        }
        if (!clientKey) {
            throw new InternalServerErrorException('MIDTRANS_CLIENT_KEY is not defined in environment variables.');
        }

        this.snapClient = new midtransClient.Snap({
            isProduction : false,
            serverKey : serverKey,
            clientKey : clientKey
        });

        console.log('Midtrans Snap Client has been successfully initialized');
    }
}
