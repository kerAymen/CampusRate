import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ProblemDetailsDto } from '../dto/problem-details.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const problemDetails: ProblemDetailsDto = {
      type: 'about:blank',
      title: HttpStatus[status] || 'Error',
      status: status,
      detail:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Une erreur est survenue.',
      instance: ctx.getRequest().url,
      errors: (exceptionResponse as any).errors || undefined,
    };

    response.status(status).json(problemDetails);
  }
}