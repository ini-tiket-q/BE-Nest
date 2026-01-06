export interface MidtransGenerateRequestDto {
    transaction_details: {
        order_id: string | number,
        gross_amount: number
    }
}