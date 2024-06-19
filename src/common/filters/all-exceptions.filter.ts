import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

enum SqliteErrorCode {
  UniqueConstraintViolation = 19, // SQLITE_CONSTRAINT_UNIQUE
  ForeignKeyViolation = 768, // SQLITE_CONSTRAINT_FOREIGNKEY
  NotNullViolation = 1299, // SQLITE_CONSTRAINT_NOTNULL
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    let message: string;

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = `${errorResponse['error'] || 'Bad Request'}: ${
        errorResponse['message'] || 'Validation failed'
      }`;
    } else if (exception instanceof QueryFailedError) {
      status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      switch (exception.driverError.errno) {
        case SqliteErrorCode.UniqueConstraintViolation:
          const constraintName = exception.driverError.message.match(
            /UNIQUE constraint failed: (.+?)\./,
          )?.[1];
          message = `Unique constraint violation on ${constraintName}`;
          status = HttpStatus.BAD_REQUEST;
          break;
        case SqliteErrorCode.ForeignKeyViolation:
          message = 'A foreign key constraint was violated.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case SqliteErrorCode.NotNullViolation:
          message = 'A not-null constraint was violated.';
          status = HttpStatus.BAD_REQUEST;
          break;
        default:
          message = 'A database error occurred.';
      }
    } else {
      status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
