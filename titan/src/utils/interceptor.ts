import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        return {
          status: {
            isSuccess: true,
            statusCode: res.statusCode,
            message: data?.message || 'Request has been successfully processed.',
          },
          data: data,
        };
      }),
    );
  }
}