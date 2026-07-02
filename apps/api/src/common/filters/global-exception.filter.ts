import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODE } from '../constants/error-code';

type ErrorBody = {
  code?: string;
  message?: string | string[];
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request & { requestId?: string }>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body = this.normalizeBody(exceptionResponse);

    if (!(exception instanceof HttpException)) {
      console.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      code: body.code ?? this.resolveCode(statusCode),
      message: body.message ?? 'Internal server error',
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private normalizeBody(exceptionResponse: unknown): ErrorBody {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const response = exceptionResponse as ErrorBody;
      return {
        code: response.code,
        message: Array.isArray(response.message)
          ? response.message.join(', ')
          : response.message,
      };
    }

    return {};
  }

  private resolveCode(statusCode: number) {
    if (statusCode === HttpStatus.BAD_REQUEST) {
      return ERROR_CODE.validationError;
    }

    return ERROR_CODE.internalServerError;
  }
}
