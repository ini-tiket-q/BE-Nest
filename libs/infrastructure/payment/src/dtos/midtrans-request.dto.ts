import { IsObject } from "class-validator"

export interface MidtransRequestDto {
    transaction_details: {
        order_id: string | number,
        gross_amount: number
    }
}