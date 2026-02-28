import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { ApiSuccessResponse as SharedApiSuccessResponse } from '@simsasukgo/shared';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<SharedApiSuccessResponse<unknown>> {
    return next.handle().pipe(
      map(
        (data: unknown): SharedApiSuccessResponse<unknown> => ({
          success: true,
          data,
          timestamp: Date.now(),
        })
      )
    );
  }
}
