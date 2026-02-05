
import { IsEmail, IsNotEmpty, IsString, IsNumber, Matches, Length } from 'class-validator';

export class CreateClientDto {
    @IsString({ message: 'El documento debe ser un texto' })
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @Matches(/^\d+$/, { message: 'El documento debe contener solo números' })
    @Length(6, 15, { message: 'El documento debe tener entre 6 y 15 dígitos' })
    document: string;

    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    names: string;

    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email: string;

    @IsString({ message: 'El teléfono debe ser un texto' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @Matches(/^\d{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos' })
    phone: string;
}

export class RechargeWalletDto {
    @IsString({ message: 'El documento debe ser un texto' })
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @Matches(/^\d+$/, { message: 'El documento debe contener solo números' })
    @Length(6, 15, { message: 'El documento debe tener entre 6 y 15 dígitos' })
    document: string;

    @IsString({ message: 'El teléfono debe ser un texto' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @Matches(/^\d{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos' })
    phone: string;

    @IsNumber({}, { message: 'El monto debe ser un número' })
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    amount: number;
}

export class RequestPaymentDto {
    @IsString({ message: 'El documento debe ser un texto' })
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @Matches(/^\d+$/, { message: 'El documento debe contener solo números' })
    @Length(6, 15, { message: 'El documento debe tener entre 6 y 15 dígitos' })
    document: string;

    @IsString({ message: 'El teléfono debe ser un texto' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @Matches(/^\d{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos' })
    phone: string;

    @IsNumber({}, { message: 'El monto debe ser un número' })
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    amount: number;
}

export class ConfirmPaymentDto {
    @IsString({ message: 'El ID de sesión debe ser un texto' })
    @IsNotEmpty({ message: 'El ID de sesión es obligatorio' })
    sessionId: string;

    @IsString({ message: 'El token debe ser un texto' })
    @IsNotEmpty({ message: 'El token es obligatorio' })
    @Matches(/^\d{6}$/, { message: 'El token debe contener exactamente 6 dígitos' })
    token: string;
}

export class CheckBalanceDto {
    @IsString({ message: 'El documento debe ser un texto' })
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @Matches(/^\d+$/, { message: 'El documento debe contener solo números' })
    @Length(6, 15, { message: 'El documento debe tener entre 6 y 15 dígitos' })
    document: string;

    @IsString({ message: 'El teléfono debe ser un texto' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @Matches(/^\d{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos' })
    phone: string;
}
