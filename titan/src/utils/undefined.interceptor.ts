// undefined로 값 반환 시 사용하려 했던 인터셉터 (지금은 사용 안 함)
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

function customStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    value === undefined ? '__undefined__' : value
  );
}

function customParse(json: string): any {
  return JSON.parse(json, (key, value) =>
    value === '__undefined__' ? undefined : value
  );
}

@Injectable()
export class UndefinedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(
      map((data) => {
        const jsonString = customStringify(data);
        const parsedData = customParse(jsonString);
        return parsedData;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
