
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);

    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    ) { }

    async registerClient(createClientDto: CreateClientDto) {
        const { document } = createClientDto;
        const existing = await this.clientModel.findOne({ document });
        if (existing) {
            throw new BadRequestException('El cliente ya está registrado');
        }

        const newClient = new this.clientModel(createClientDto);
        await newClient.save();

        this.logger.log(`Cliente registrado localmente: ${document}`);

        return {
            success: true,
            message: 'Cliente registrado exitosamente',
            data: newClient,
        };
    }

    async rechargeWallet(rechargeDto: RechargeWalletDto) {
        const { document, phone, amount } = rechargeDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado o el teléfono no coincide');
        }
        client.balance += amount;
        await client.save();
        return {
            success: true,
            message: 'Billetera recargada exitosamente',
            data: { balance: client.balance },
        };
    }

    async requestPayment(requestDto: RequestPaymentDto) {
        const { document, phone, amount } = requestDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        if (client.balance < amount) {
            throw new BadRequestException('Saldo insuficiente');
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = uuidv4();

        // Simulación de envío de token (en producción se usaría un servicio de correo/SMS)
        this.logger.log(`[SIMULACIÓN EMAIL] Enviando token ${token} a ${client.email}`);
        console.log(`\n************************************************`);
        console.log(` TOKEN DE PAGO PARA ${client.names.toUpperCase()}`);
        console.log(` TOKEN: ${token}`);
        console.log(`************************************************\n`);

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
            message: 'Token enviado al correo electrónico (Simulado en consola)',
            data: { sessionId },
        };
    }

    async confirmPayment(confirmDto: ConfirmPaymentDto) {
        const { sessionId, token } = confirmDto;
        const session = await this.sessionModel.findOne({ sessionId, status: 'PENDING' });

        if (!session) {
            throw new NotFoundException('Sesión inválida o expirada');
        }
        if (session.token !== token) {
            throw new BadRequestException('Token inválido');
        }

        const client = await this.clientModel.findOne({ document: session.clientId });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        if (client.balance < session.amount) {
            throw new BadRequestException('Saldo insuficiente');
        }

        client.balance -= session.amount;
        await client.save();

        session.status = 'COMPLETED';
        await session.save();

        return {
            success: true,
            message: 'Pago confirmado exitosamente',
            data: { newBalance: client.balance },
        };
    }

    async getBalance(checkBalanceDto: CheckBalanceDto) {
        const { document, phone } = checkBalanceDto;
        const client = await this.clientModel.findOne({ document, phone });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        return {
            success: true,
            message: 'Saldo consultado exitosamente',
            data: { balance: client.balance },
        };
    }
}
