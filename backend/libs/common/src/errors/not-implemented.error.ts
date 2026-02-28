import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '@simsasukgo/shared';

export class NotImplementedError extends HttpException {
  constructor(target: string) {
    super(
      {
        status: 'not_implemented',
        target,
        error: {
          code: ERROR_CODES.COMMON_NOT_IMPLEMENTED,
          source: 'backend',
        },
      },
      HttpStatus.NOT_IMPLEMENTED
    );
  }
}
