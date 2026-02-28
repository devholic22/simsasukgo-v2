import { BadRequestException } from '@nestjs/common';
import { ERROR_CODES } from '@simsasukgo/shared';

export function createValidationException(details: string): BadRequestException {
  return new BadRequestException({
    error: {
      code: ERROR_CODES.COMMON_VALIDATION,
      source: 'backend',
      details,
    },
  });
}
