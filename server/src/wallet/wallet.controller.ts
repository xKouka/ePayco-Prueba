
import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
    CreateClientDto,
    RechargeWalletDto,
    RequestPaymentDto,
    ConfirmPaymentDto,
    CheckBalanceDto,
} from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('registerCliente')
    @UsePipes(new ValidationPipe())
    registerClient(@Body() createClientDto: CreateClientDto) {
        return this.walletService.registerClient(createClientDto);
    }

    @Post('recargarBilletera')
    @UsePipes(new ValidationPipe())
    rechargeWallet(@Body() rechargeDto: RechargeWalletDto) {
        return this.walletService.rechargeWallet(rechargeDto);
    }

    @Post('solicitarPago')
    @UsePipes(new ValidationPipe())
    requestPayment(@Body() requestDto: RequestPaymentDto) {
        return this.walletService.requestPayment(requestDto);
    }

    @Post('confirmarPago')
    @UsePipes(new ValidationPipe())
    confirmPayment(@Body() confirmDto: ConfirmPaymentDto) {
        return this.walletService.confirmPayment(confirmDto);
    }

    @Get('consultarSaldo')
    @UsePipes(new ValidationPipe({ transform: true }))
    getBalance(@Query() checkBalanceDto: CheckBalanceDto) {
        return this.walletService.getBalance(checkBalanceDto);
    }
}
