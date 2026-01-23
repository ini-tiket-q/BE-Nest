import { IsNumber, IsString } from "class-validator"

export class CreatePaymentDto {
    @IsString()
    order_id: string
    @IsNumber()
    gross_amount: number
}
