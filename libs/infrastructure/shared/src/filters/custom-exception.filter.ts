import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { TransactionNotFoundException } from '@tiketq-be/transactions'
import { MidtransHttpError } from "libs/infrastructure/payment/src/exception/midtrans-http-error";

@Catch(Error)
export class FilterException implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    catch(exception: Error, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        let responseBody = {
            message: 'something wrong on our side',
            error: 'internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }

        if (exception instanceof TransactionNotFoundException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.NOT_FOUND
            }
        } else if (exception instanceof MidtransHttpError) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: exception.status
            }
        }
        httpAdapter.reply(res, responseBody, responseBody.statusCode)
    }   
}