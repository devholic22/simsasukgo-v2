import {
  AUTH_DUPLICATE_EMAIL_POSSIBLE,
  AUTH_SIGN_UP_REQUESTED,
  BASE_DATA_INIT_SUCCESS,
  COMMON_UNKNOWN_ERROR,
  ERROR_CODES,
  t,
  type AppError,
  type Locale,
  type MessageCode,
  type Trip,
  type UserPreference,
} from '@simsasukgo/shared';
import { getBaseData, initializeBaseData as initializeBaseDataApi } from './backend-api';
import { DEFAULT_LOCALE } from './i18n';

type SupabaseAuthError = { message: string } | null;
type SupabaseSignUpData = { user: { identities?: unknown[] | null } | null } | null;

export function getErrorMessage(error: unknown, locale: Locale = DEFAULT_LOCALE): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const maybe = error as { message?: string; code?: string; details?: string };
    if (maybe.message) return maybe.message;
    if (maybe.details) return maybe.details;
    if (maybe.code) return `Error code: ${maybe.code}`;
    try {
      return JSON.stringify(error);
    } catch {
      return t(locale, COMMON_UNKNOWN_ERROR);
    }
  }
  return t(locale, COMMON_UNKNOWN_ERROR);
}

export function getSignUpMessage(input: {
  error: SupabaseAuthError;
  data: SupabaseSignUpData;
  locale?: Locale;
}): string {
  return getSignUpResult(input).message;
}

export function getSignUpResult(input: {
  error: SupabaseAuthError;
  data: SupabaseSignUpData;
  locale?: Locale;
}): {
  ok: boolean;
  messageCode: MessageCode;
  message: string;
  error?: AppError;
} {
  const locale = input.locale ?? DEFAULT_LOCALE;
  if (input.error) {
    return {
      ok: false,
      messageCode: COMMON_UNKNOWN_ERROR,
      message: input.error.message,
      error: {
        code: ERROR_CODES.AUTH_SIGN_UP_FAILED,
        source: 'supabase',
        message: input.error.message,
      },
    };
  }

  const identities = input.data?.user?.identities;
  if (Array.isArray(identities) && identities.length === 0) {
    return {
      ok: false,
      messageCode: AUTH_DUPLICATE_EMAIL_POSSIBLE,
      message: t(locale, AUTH_DUPLICATE_EMAIL_POSSIBLE),
      error: {
        code: ERROR_CODES.AUTH_DUPLICATE_EMAIL_POSSIBLE,
        source: 'supabase',
        message: t(locale, AUTH_DUPLICATE_EMAIL_POSSIBLE),
      },
    };
  }

  return {
    ok: true,
    messageCode: AUTH_SIGN_UP_REQUESTED,
    message: t(locale, AUTH_SIGN_UP_REQUESTED),
  };
}

export async function loadBaseData(input: {
  accessToken: string;
  getBaseDataFn?: typeof getBaseData;
}): Promise<{
  trip: Trip | null;
  preference: UserPreference | null;
}> {
  const getBaseDataFn = input.getBaseDataFn ?? getBaseData;
  const result = await getBaseDataFn({ accessToken: input.accessToken });

  if (!result.ok) {
    throw result.error;
  }

  return result.data;
}

export async function initializeBaseData(input: {
  accessToken: string;
  locale?: Locale;
  initializeBaseDataFn?: typeof initializeBaseDataApi;
}): Promise<{ ok: boolean; messageCode: MessageCode; message: string; error?: AppError }> {
  const locale = input.locale ?? DEFAULT_LOCALE;
  const initializeBaseDataFn = input.initializeBaseDataFn ?? initializeBaseDataApi;
  const result = await initializeBaseDataFn({ accessToken: input.accessToken });

  if (!result.ok) {
    return {
      ok: false,
      messageCode: COMMON_UNKNOWN_ERROR,
      message: getErrorMessage(result.error, locale),
      error: result.error,
    };
  }

  return {
    ok: true,
    messageCode: BASE_DATA_INIT_SUCCESS,
    message: t(locale, BASE_DATA_INIT_SUCCESS),
  };
}
