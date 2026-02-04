
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    names: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}

export class RechargeWalletDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}

export class RequestPaymentDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}

export class ConfirmPaymentDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}

export class CheckBalanceDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
