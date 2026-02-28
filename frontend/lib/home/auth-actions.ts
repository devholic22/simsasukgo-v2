import {
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_OUT_SUCCESS,
  COMMON_AUTH_REQUIRED,
  BACKEND_PROBE_FAILED,
  BACKEND_PROBE_SUCCESS,
  COMMON_UNKNOWN_ERROR,
  ERROR_CODES,
  t,
  type AppError,
  type Locale,
  type MessageCode,
} from '@simsasukgo/shared';
import { getSignUpResult, initializeBaseData } from '../auth-data';
import { searchPlaces } from '../backend-api';
import { formatBackendProbeCount, getHomeBackendProbeQuery } from './constants';

type AuthError = { message: string } | null;

type AuthSignUpApi = {
  signUp: (input: { email: string; password: string }) => Promise<{
    error: AuthError;
    data: { user: { identities?: unknown[] | null } | null } | null;
  }>;
};

type AuthSignInApi = {
  signInWithPassword: (input: { email: string; password: string }) => Promise<{ error: AuthError }>;
};

type AuthSignOutApi = {
  signOut: () => Promise<{ error: AuthError }>;
};

export type AuthActionResult = {
  ok: boolean;
  messageCode: MessageCode;
  message: string;
  error?: AppError;
};

export async function runSignUpAction(input: {
  authApi: AuthSignUpApi;
  email: string;
  password: string;
  locale: Locale;
}): Promise<AuthActionResult> {
  const { authApi, email, password, locale } = input;
  const response = await authApi.signUp({ email, password });
  const result = getSignUpResult({
    error: response.error,
    data: response.data,
    locale,
  });

  return {
    ok: result.ok,
    messageCode: result.messageCode,
    message: result.message,
    error: result.error,
  };
}

export async function runSignInAction(input: {
  authApi: AuthSignInApi;
  email: string;
  password: string;
  locale: Locale;
}): Promise<AuthActionResult> {
  const { authApi, email, password, locale } = input;
  const { error } = await authApi.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      messageCode: COMMON_UNKNOWN_ERROR,
      message: error.message,
      error: {
        code: ERROR_CODES.AUTH_SIGN_IN_FAILED,
        source: 'supabase',
        message: error.message,
      },
    };
  }

  return {
    ok: true,
    messageCode: AUTH_SIGN_IN_SUCCESS,
    message: t(locale, AUTH_SIGN_IN_SUCCESS),
  };
}

export async function runSignOutAction(input: {
  authApi: AuthSignOutApi;
  locale: Locale;
}): Promise<AuthActionResult> {
  const { authApi, locale } = input;
  const { error } = await authApi.signOut();

  if (error) {
    return {
      ok: false,
      messageCode: COMMON_UNKNOWN_ERROR,
      message: error.message,
      error: {
        code: ERROR_CODES.AUTH_SIGN_OUT_FAILED,
        source: 'supabase',
        message: error.message,
      },
    };
  }

  return {
    ok: true,
    messageCode: AUTH_SIGN_OUT_SUCCESS,
    message: t(locale, AUTH_SIGN_OUT_SUCCESS),
  };
}

export async function runInitializeBaseDataAction(input: {
  accessToken: string;
  locale: Locale;
  initializeBaseDataFn?: typeof initializeBaseData;
}): Promise<AuthActionResult> {
  const { accessToken, locale, initializeBaseDataFn = initializeBaseData } = input;
  const result = await initializeBaseDataFn({
    accessToken,
    locale,
  });

  return {
    ok: result.ok,
    messageCode: result.messageCode,
    message: result.message,
    error: result.error,
  };
}

export async function runBackendSearchProbeAction(input: {
  query?: string;
  locale: Locale;
  accessToken?: string;
  searchPlacesFn?: typeof searchPlaces;
}): Promise<AuthActionResult> {
  const locale = input.locale;
  const query = input.query ?? getHomeBackendProbeQuery(locale);
  const accessToken = input.accessToken?.trim();
  const searchPlacesFn = input.searchPlacesFn ?? searchPlaces;
  if (!accessToken) {
    return {
      ok: false,
      messageCode: COMMON_AUTH_REQUIRED,
      message: t(locale, COMMON_AUTH_REQUIRED),
      error: {
        code: ERROR_CODES.COMMON_UNAUTHORIZED,
        source: 'frontend',
      },
    };
  }

  const result = await searchPlacesFn({ query, accessToken });

  if (!result.ok) {
    return {
      ok: false,
      messageCode: BACKEND_PROBE_FAILED,
      message: `${t(locale, BACKEND_PROBE_FAILED)}: ${result.error.code} (${result.error.source})`,
      error: result.error,
    };
  }

  return {
    ok: true,
    messageCode: BACKEND_PROBE_SUCCESS,
    message: `${t(locale, BACKEND_PROBE_SUCCESS)}: ${formatBackendProbeCount(locale, result.data.length)}`,
  };
}
