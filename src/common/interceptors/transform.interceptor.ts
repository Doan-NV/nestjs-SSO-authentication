import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from 'src/interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IResponse<T>> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(map((data) => ({ success: true, data, message: request.message })));
  }
}
