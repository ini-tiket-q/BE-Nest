import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from '../guards/throttler.guard';

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 60000,  // 60 seconds
            limit: 10,   // 10 requests per ttl
        }]),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AppThrottlerGuard,
        },
    ],
    exports: [ThrottlerModule],
})
export class AppThrottlerModule { }
