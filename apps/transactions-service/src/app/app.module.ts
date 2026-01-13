import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionsController } from './transactions.controller';
import { TransactionsModule } from '@tiketq-be/application/transactions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    TransactionsModule,
  ],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }

