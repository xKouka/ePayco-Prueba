import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { WalletSession } from './entities/session.entity';
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
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(WalletSession) private sessionRepository: Repository<WalletSession>,
    ) { }

    async registerClient(createClientDto: CreateClientDto) {
        const { document } = createClientDto;
        const existing = await this.clientRepository.findOne({ where: { document } });
        if (existing) {
            throw new BadRequestException('El cliente ya está registrado');
        }

        const newClient = this.clientRepository.create(createClientDto);
        await this.clientRepository.save(newClient);

        this.logger.log(`Cliente registrado en MySQL: ${document}`);

        return {
            success: true,
            message: 'Cliente registrado exitosamente',
            data: newClient,
        };
    }

    async rechargeWallet(rechargeDto: RechargeWalletDto) {
        const { document, phone, amount } = rechargeDto;
        const client = await this.clientRepository.findOne({ where: { document, phone } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado o el teléfono no coincide');
        }

        // Manejo de precisión decimal en base de datos
        client.balance = Number(client.balance) + Number(amount);
        await this.clientRepository.save(client);

        return {
            success: true,
            message: 'Billetera recargada exitosamente',
            data: { balance: client.balance },
        };
    }

    async requestPayment(requestDto: RequestPaymentDto) {
        const { document, phone, amount } = requestDto;
        const client = await this.clientRepository.findOne({ where: { document, phone } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        if (Number(client.balance) < Number(amount)) {
            throw new BadRequestException('Saldo insuficiente');
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = uuidv4();

        this.logger.log(`[SIMULACIÓN EMAIL] Enviando token ${token} a ${client.email}`);
        console.log(`\n************************************************`);
        console.log(` TOKEN DE PAGO PARA ${client.names.toUpperCase()}`);
        console.log(` TOKEN: ${token}`);
        console.log(`************************************************\n`);

        const session = this.sessionRepository.create({
            session_id: sessionId,
            token,
            client_id: document,
            amount,
            status: 'PENDING',
        });
        await this.sessionRepository.save(session);

        return {
            success: true,
            message: 'Token enviado al correo electrónico (Simulado en consola)',
            data: { sessionId },
        };
    }

    async confirmPayment(confirmDto: ConfirmPaymentDto) {
        const { sessionId, token } = confirmDto;
        const session = await this.sessionRepository.findOne({
            where: { session_id: sessionId, status: 'PENDING' }
        });

        if (!session) {
            throw new NotFoundException('Sesión inválida o expirada');
        }
        if (session.token !== token) {
            throw new BadRequestException('Token inválido');
        }

        const client = await this.clientRepository.findOne({ where: { document: session.client_id } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        if (Number(client.balance) < Number(session.amount)) {
            throw new BadRequestException('Saldo insuficiente');
        }

        client.balance = Number(client.balance) - Number(session.amount);
        await this.clientRepository.save(client);

        session.status = 'COMPLETED';
        await this.sessionRepository.save(session);

        return {
            success: true,
            message: 'Pago confirmado exitosamente',
            data: { newBalance: client.balance },
        };
    }

    async getBalance(checkBalanceDto: CheckBalanceDto) {
        const { document, phone } = checkBalanceDto;
        const client = await this.clientRepository.findOne({ where: { document, phone } });
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
