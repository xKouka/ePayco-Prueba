
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: number;
    message: string;
    data: T;
    error: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe(
            map((res) => {
                return {
                    status: response.statusCode,
                    message: res?.message || 'Operación exitosa',
                    data: res?.data || res || null,
                    error: null,
                };
            }),
        );
    }
}
