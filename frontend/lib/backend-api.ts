import {
  ERROR_CODES,
  isErrorCode,
  isErrorSource,
  type ApiResponse,
  type AppError,
  type GetOptimizedRouteInput,
  type GetOptimizedRouteOutput,
  type SearchPlaceItem,
  type SearchPlacesInput,
  type SyncOpenStatusInput,
  type SyncOpenStatusItem,
  type Trip,
  type UserPreference,
} from '@simsasukgo/shared';

export type BackendApiResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; statusCode: number; error: AppError };

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type RequestMethod = 'GET' | 'POST';

export type BaseDataPayload = {
  trip: Trip | null;
  preference: UserPreference | null;
};

type AuthorizedRequestInput = {
  accessToken: string;
};

type AuthorizedSearchPlacesInput = SearchPlacesInput & AuthorizedRequestInput;
type AuthorizedSyncOpenStatusInput = SyncOpenStatusInput & AuthorizedRequestInput;
type AuthorizedGetOptimizedRouteInput = GetOptimizedRouteInput & AuthorizedRequestInput;

function getBackendBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function toUnknownError(input: {
  statusCode: number;
  message?: string;
  source?: AppError['source'];
}): BackendApiResult<never> {
  return {
    ok: false,
    statusCode: input.statusCode,
    error: {
      code: ERROR_CODES.COMMON_UNKNOWN,
      source: input.source ?? 'unknown',
      message: input.message,
    },
  };
}

function parseApiResponse<TData>(statusCode: number, raw: unknown): BackendApiResult<TData> {
  if (!raw || typeof raw !== 'object') {
    return toUnknownError({ statusCode, source: 'backend' });
  }

  const envelope = raw as Partial<ApiResponse<TData>>;

  if (envelope.success === true && 'data' in envelope) {
    return {
      ok: true,
      data: envelope.data as TData,
    };
  }

  if (envelope.success === false && envelope.error && typeof envelope.error === 'object') {
    const code = isErrorCode(envelope.error.code)
      ? envelope.error.code
      : ERROR_CODES.COMMON_UNKNOWN;
    const source = isErrorSource(envelope.error.source) ? envelope.error.source : 'backend';

    return {
      ok: false,
      statusCode,
      error: {
        code,
        source,
        message: envelope.error.message,
        details: envelope.error.details,
      },
    };
  }

  return toUnknownError({ statusCode, source: 'backend' });
}

function buildRequestHeaders(input: {
  hasJsonBody: boolean;
  accessToken?: string;
}): Record<string, string> {
  const headers: Record<string, string> = {};

  if (input.hasJsonBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (input.accessToken) {
    headers.Authorization = `Bearer ${input.accessToken}`;
  }

  return headers;
}

async function requestBackend<TData, TBody = undefined>(input: {
  path: string;
  method: RequestMethod;
  body?: TBody;
  fetcher?: Fetcher;
  accessToken?: string;
}): Promise<BackendApiResult<TData>> {
  const url = `${getBackendBaseUrl()}${normalizePath(input.path)}`;
  const fetcher = input.fetcher ?? fetch;
  const hasBody = input.body !== undefined;

  try {
    const response = await fetcher(url, {
      method: input.method,
      headers: buildRequestHeaders({
        hasJsonBody: hasBody,
        accessToken: input.accessToken,
      }),
      body: hasBody ? JSON.stringify(input.body) : undefined,
    });

    const raw = (await response.json().catch(() => null)) as unknown;
    const parsed = parseApiResponse<TData>(response.status, raw);

    if (response.ok && parsed.ok) {
      return parsed;
    }

    if (!parsed.ok) {
      return parsed;
    }

    return toUnknownError({ statusCode: response.status, source: 'backend' });
  } catch (error) {
    return toUnknownError({
      statusCode: 0,
      source: 'unknown',
      message: error instanceof Error ? error.message : undefined,
    });
  }
}

export function searchPlaces(
  input: AuthorizedSearchPlacesInput,
  fetcher?: Fetcher
): Promise<BackendApiResult<SearchPlaceItem[]>> {
  const { accessToken, ...payload } = input;

  return requestBackend<SearchPlaceItem[], SearchPlacesInput>({
    path: '/places/search',
    method: 'POST',
    body: payload,
    fetcher,
    accessToken,
  });
}

export function syncOpenStatus(
  input: AuthorizedSyncOpenStatusInput,
  fetcher?: Fetcher
): Promise<BackendApiResult<SyncOpenStatusItem[]>> {
  const { accessToken, ...payload } = input;

  return requestBackend<SyncOpenStatusItem[], SyncOpenStatusInput>({
    path: '/places/open-status/sync',
    method: 'POST',
    body: payload,
    fetcher,
    accessToken,
  });
}

export function getOptimizedRoute(
  input: AuthorizedGetOptimizedRouteInput,
  fetcher?: Fetcher
): Promise<BackendApiResult<GetOptimizedRouteOutput>> {
  const { accessToken, ...payload } = input;

  return requestBackend<GetOptimizedRouteOutput, GetOptimizedRouteInput>({
    path: '/routes/optimize',
    method: 'POST',
    body: payload,
    fetcher,
    accessToken,
  });
}

export function getBaseData(
  input: AuthorizedRequestInput,
  fetcher?: Fetcher
): Promise<BackendApiResult<BaseDataPayload>> {
  return requestBackend<BaseDataPayload>({
    path: '/base-data',
    method: 'GET',
    fetcher,
    accessToken: input.accessToken,
  });
}

export function initializeBaseData(
  input: AuthorizedRequestInput,
  fetcher?: Fetcher
): Promise<BackendApiResult<BaseDataPayload>> {
  return requestBackend<BaseDataPayload, Record<string, never>>({
    path: '/base-data/initialize',
    method: 'POST',
    body: {},
    fetcher,
    accessToken: input.accessToken,
  });
}
