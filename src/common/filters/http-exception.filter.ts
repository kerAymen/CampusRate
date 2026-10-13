import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ProblemDetailsDto } from '../dto/problem-details.dto';
import { MongoServerError } from 'mongodb';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof MongoServerError && exception.code === 11000) {
      exception = new HttpException(
        'Une valeur unique existe déjà.',
        HttpStatus.CONFLICT,
      );
    }

    if (
      exception instanceof Error &&
      'status' in exception &&
      exception.status === 413
    ) {
      exception = new HttpException(
        'Le corps de la requête est trop gros.',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Une erreur interne est survenue.';

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

    const request = ctx.getRequest();
    this.logger.error(
      `${request.method} ${request.path} - ${status}`,
    );

    response
      .status(status)
      .type('application/problem+json')
      .json(problemDetails);
  }
}