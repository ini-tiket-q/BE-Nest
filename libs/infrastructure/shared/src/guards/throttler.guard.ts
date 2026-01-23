import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
    protected throwThrottlingException(): Promise<void> {
        throw new HttpException(
            {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'Too many requests. Please try again later.',
                error: 'Too Many Requests',
            },
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }
}
