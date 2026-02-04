
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import {
    CreateClientDto,
    RechargeWalletDto,
    RequestPaymentDto,
    ConfirmPaymentDto,
    CheckBalanceDto,
} from './dto/wallet.dto';
import { v4 as uuidv4 } from 'uuid'; // I might need to install uuid or just use crypto

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    ) { }

    async registerClient(createClientDto: CreateClientDto) {
        const { document } = createClientDto;
        const existing = await this.clientModel.findOne({ document });
        if (existing) {
            throw new BadRequestException('Client already exists');
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

        const session = new this.sessionModel({
            sessionId,
            token,
            clientId: document, // Using document as reference
            amount,
            status: 'PENDING',
        });
        await session.save();

        console.log(`Sending token ${token} to email ${client.email}`); // Simulation

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
