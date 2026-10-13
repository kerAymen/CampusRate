import {
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware 
    implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const start = Date.now();

    response.on('finish', () => {
      const duration = Date.now() - start;

      if (response.statusCode < 400) {
        this.logger.log(
          `${request.method} ${request.path} - ${response.statusCode} - ${duration}ms`,
        );
      }
    });

    next();
  }
}