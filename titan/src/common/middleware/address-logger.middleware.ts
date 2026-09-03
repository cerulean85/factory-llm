import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { formatDate } from 'src/utils/dummy.util';

@Injectable()
export class AddressLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${formatDate(new Date())}] [${req.method}] ${req.originalUrl}`);
    next();
  }
}