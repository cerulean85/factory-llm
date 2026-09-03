import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, connection, socket } = request;

    // 다양한 방법으로 클라이언트 IP 추출
    let clientIp =
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      headers['x-client-ip'] ||
      ip ||
      connection?.remoteAddress ||
      socket?.remoteAddress ||
      request.ip;

    // IPv6 loopback을 IPv4로 변환
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
      clientIp = '127.0.0.1';
    }

    // IPv6 형태에서 IPv4 추출
    if (clientIp && clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7);
    }

    // IP가 여전히 없으면 기본값 설정
    if (!clientIp) {
      clientIp = 'unknown';
    }

    // 클라이언트 포트 정보 추출
    const clientPort =
      headers['x-forwarded-port'] ||
      connection?.remotePort ||
      socket?.remotePort ||
      'unknown';

    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const responseTime = Date.now() - startTime;

        this.logger.log(
          `[${method}] ${clientIp}:${clientPort} - ${url} / ${statusCode} / ${responseTime}ms`,
          {
            metadata: {
              ip: clientIp,
              port: clientPort,
            },
          },
        );
      }),
    );
  }
}
