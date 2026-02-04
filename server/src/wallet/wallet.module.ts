import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Client, ClientSchema } from './schemas/client.schema';
import { Session, SessionSchema } from './schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule { }
