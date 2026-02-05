import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Client } from './entities/client.entity';
import { WalletSession } from './entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, WalletSession]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule { }
