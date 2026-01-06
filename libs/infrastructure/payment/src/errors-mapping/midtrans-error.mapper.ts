import { BadGatewayException, BadRequestException, InternalServerErrorException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common"
import { MidtransHttpError } from "../exception/midtrans-http-error"


export function handleMidtransError(error: unknown): void {
    if (error instanceof MidtransHttpError) {   
        if(error.status === 401 || error.status === 403) {
            throw new UnauthorizedException('acess denied due to midtrans authentication failed')
        } else if(error.status === 500) {
            throw new InternalServerErrorException('Internal Server Error')
        } else if(error.status === 502) {
            throw new BadGatewayException('Timeout Internal')
        } else if (error.status === 503) {
            throw new ServiceUnavailableException();
        }
    }
}