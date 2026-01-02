import { IsNumber, IsString } from "class-validator"

export class CreatePaymentDto {
    @IsString()
    @IsNumber()
    order_id: string | number
    @IsNumber()
    gross_amount: number
}
