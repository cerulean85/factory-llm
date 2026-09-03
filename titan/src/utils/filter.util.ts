import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
@Injectable()
@Catch()
export class GlobalControllerExceptionFilter implements ExceptionFilter {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger(GlobalControllerExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
  
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'A server error has occurred.' };

    this.logger.error(`Exception caught in GlobalControllerExceptionFilter: ${request.url}\r\n-message: ${exception.message}\r\n-stack: ${exception.stack}\r\n-params: ${JSON.stringify(exception)}`);
    if(exception?.query){
      this.logger.error(`RawQuery: ${exception.query}`);
    }
    // 핸들러 정보 접근 방식 변경
    let dto;
    try {
      // Express 라우터에서 가능한 경우 라우트 핸들러 정보 가져오기
      if (request.route && request.route.stack && request.route.stack.length > 0) {
        const handler = request.route.stack[0].handle;
        dto = this.reflector.get<any>('return_dto', handler);
      }
    } catch (err) {
      // 핸들러 정보를 가져오는 데 실패하면 조용히 넘어갑니다
      console.log('Failed to get handler metadata:', err);
    }

    const data = this.createUndefinedData(dto);

    response.status(status).json({
      status: {
        isSuccess: false,
        statusCode: status,
        message: typeof message === 'string' ? message : message['message'],
      },
      data,
    });
  }


  private createUndefinedData(dto: any): any {
    if (!dto) return null;

    // 페이지네이션 DTO일 경우
    if (dto?.TargetDto) {
      const innerDto = dto.TargetDto;
      
      const dummyItem = new innerDto();
      return new PaginationResponseDto([dummyItem], -1, 1, -1);
    }

    return new dto();
  }
}