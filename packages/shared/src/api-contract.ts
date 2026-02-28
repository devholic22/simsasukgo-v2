import { ERROR_CODES, type AppError, type ErrorCode, type ErrorSource } from './error-codes';

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  timestamp: number;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  path?: string;
  error: AppError;
  timestamp: number;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export function isErrorCode(value: unknown): value is ErrorCode {
  if (typeof value !== 'string') {
    return false;
  }

  return Object.values(ERROR_CODES).includes(value as ErrorCode);
}

export function isErrorSource(value: unknown): value is ErrorSource {
  return value === 'frontend' || value === 'backend' || value === 'supabase' || value === 'unknown';
}
