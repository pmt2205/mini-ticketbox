import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-code';

export class AppException extends HttpException {
  constructor(
    readonly code: ErrorCode,
    message: string,
    statusCode: HttpStatus,
  ) {
    super({ code, message }, statusCode);
  }
}
