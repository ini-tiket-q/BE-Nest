import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionModel } from './models/transaction.model';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.model{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([TransactionModel]),
  ],
  providers: [
    {
      provide: 'ITransactionRepositoryPort',
      useClass: TransactionRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'ITransactionRepositoryPort',
  ],
})
export class DatabaseModule {}
