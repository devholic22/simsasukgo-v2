import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import {
  ERROR_CODES,
  isErrorCode,
  isErrorSource,
  type ApiErrorResponse,
  type AppError,
} from '@simsasukgo/shared';

type ErrorPayload = {
  error?: {
    code?: string;
    source?: string;
    message?: string;
    details?: string;
  };
};

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (statusCode: number) => { json: (body: unknown) => void };
    }>();
    const request = ctx.getRequest<{ url: string }>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : null;
    const payload: ErrorPayload =
      exceptionResponse && typeof exceptionResponse === 'object'
        ? (exceptionResponse as ErrorPayload)
        : {};

    const rawCode = payload.error?.code;
    const rawSource = payload.error?.source;

    const error: AppError = {
      code: isErrorCode(rawCode) ? rawCode : ERROR_CODES.COMMON_UNKNOWN,
      source: isErrorSource(rawSource) ? rawSource : 'backend',
    };

    if (payload.error?.message) {
      error.message = payload.error.message;
    }
    if (payload.error?.details) {
      error.details = payload.error.details;
    }

    const body: ApiErrorResponse = {
      success: false,
      statusCode: status,
      path: request.url,
      error,
      timestamp: Date.now(),
    };

    response.status(status).json(body);
  }
}
