
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = exception instanceof HttpException
            ? exception.getResponse()
            : null;

        let message = 'Error interno del servidor';
        let errorDetails = exception.message || 'Error desconocido';

        if (exceptionResponse) {
            if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || message;
                errorDetails = (exceptionResponse as any).error || errorDetails;
            } else {
                message = exceptionResponse;
            }
        }

        // Si el mensaje es un array (errores de validación), tomamos el primero o lo unimos
        if (Array.isArray(message)) {
            message = message[0];
        }

        response.status(status).json({
            status: status,
            message: message,
            data: null,
            error: errorDetails,
        });
    }
}
