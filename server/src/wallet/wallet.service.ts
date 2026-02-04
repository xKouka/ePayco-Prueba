
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Client, ClientDocument } from './schemas/client.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import {
    CreateClientDto,
    RechargeWalletDto,
    RequestPaymentDto,
    ConfirmPaymentDto,
    CheckBalanceDto,
} from './dto/wallet.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);
    private readonly laravelApiUrl = 'http://localhost:8000/api'; // Laravel Service URL

    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        private readonly httpService: HttpService,
    ) { }

    async registerClient(createClientDto: CreateClientDto) {
        const { document } = createClientDto;
        const existing = await this.clientModel.findOne({ document });
        if (existing) {
            throw new BadRequestException('Client already exists');
        }

        // Call Laravel Service to register User (Sync User Data)
        try {
            await firstValueFrom(
                this.httpService.post(`${this.laravelApiUrl}/clients`, createClientDto)
            );
            this.logger.log('Client registered in Laravel Service');
        } catch (error) {
            this.logger.warn('Laravel Service unavailable. Registering locally only.');
        }

        const newClient = new this.clientModel(createClientDto);
        await newClient.save();
        return {
            success: true,
            message: 'Client registered successfully',
            data: newClient,
        };
    }

    async rechargeWallet(rechargeDto: RechargeWalletDto) {
        const { document, phone, amount } = rechargeDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Client not found or phone mismatch');
        }
        client.balance += amount;
        await client.save();
        return {
            success: true,
            message: 'Wallet recharged successfully',
            data: { balance: client.balance },
        };
    }

    async requestPayment(requestDto: RequestPaymentDto) {
        const { document, phone, amount } = requestDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        if (client.balance < amount) {
            throw new BadRequestException('Insufficient balance');
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = uuidv4();

        // Call Laravel Service to send Token (Email Service)
        try {
            await firstValueFrom(
                this.httpService.post(`${this.laravelApiUrl}/send-token`, {
                    email: client.email,
                    token: token
                })
            );
            this.logger.log(`Token sent via Laravel to ${client.email}`);
        } catch (error) {
            this.logger.warn(`Laravel Service unavailable. Simulating email token: ${token}`);
            console.log(`[FALLBACK] Sending token ${token} to email ${client.email}`);
        }

        const session = new this.sessionModel({
            sessionId,
            token,
            clientId: document,
            amount,
            status: 'PENDING',
        });
        await session.save();

        return {
            success: true,
            message: 'Token sent to email',
            data: { sessionId },
        };
    }

    async confirmPayment(confirmDto: ConfirmPaymentDto) {
        const { sessionId, token } = confirmDto;
        const session = await this.sessionModel.findOne({ sessionId, status: 'PENDING' });

        if (!session) {
            throw new NotFoundException('Session invalid or expired');
        }
        if (session.token !== token) {
            throw new BadRequestException('Invalid token');
        }

        const client = await this.clientModel.findOne({ document: session.clientId });
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        if (client.balance < session.amount) {
            throw new BadRequestException('Insufficient balance');
        }

        client.balance -= session.amount;
        await client.save();

        session.status = 'COMPLETED';
        await session.save();

        return {
            success: true,
            message: 'Payment confirmed successfully',
            data: { newBalance: client.balance },
        };
    }

    async getBalance(checkBalanceDto: CheckBalanceDto) {
        const { document, phone } = checkBalanceDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        return {
            success: true,
            message: 'Balance retrieved',
            data: { balance: client.balance },
        };
    }
}
