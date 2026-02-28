export const SUPPORTED_LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const COMMON_UNKNOWN_ERROR = 'COMMON_UNKNOWN_ERROR';
export const COMMON_AUTH_REQUIRED = 'COMMON_AUTH_REQUIRED';
export const AUTH_SIGN_UP_REQUESTED = 'AUTH_SIGN_UP_REQUESTED';
export const AUTH_DUPLICATE_EMAIL_POSSIBLE = 'AUTH_DUPLICATE_EMAIL_POSSIBLE';
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS';
export const AUTH_SIGN_OUT_SUCCESS = 'AUTH_SIGN_OUT_SUCCESS';
export const BASE_DATA_INIT_SUCCESS = 'BASE_DATA_INIT_SUCCESS';
export const BASE_DATA_API_SHAPE_MISMATCH = 'BASE_DATA_API_SHAPE_MISMATCH';
export const BACKEND_PROBE_SUCCESS = 'BACKEND_PROBE_SUCCESS';
export const BACKEND_PROBE_FAILED = 'BACKEND_PROBE_FAILED';

export const APP_MESSAGES = {
  [COMMON_UNKNOWN_ERROR]: {
    ko: '알 수 없는 오류가 발생했습니다.',
    en: 'An unknown error occurred.',
  },
  [COMMON_AUTH_REQUIRED]: {
    ko: '로그인이 필요합니다.',
    en: 'Sign-in is required.',
  },
  [AUTH_SIGN_UP_REQUESTED]: {
    ko: '회원가입 요청 완료. 이메일 인증 설정 여부를 확인하세요.',
    en: 'Sign-up request completed. Check your email confirmation settings.',
  },
  [AUTH_DUPLICATE_EMAIL_POSSIBLE]: {
    ko: '이미 가입된 이메일일 수 있습니다. 로그인 또는 비밀번호 재설정을 시도하세요.',
    en: 'This email may already be registered. Try signing in or resetting your password.',
  },
  [AUTH_SIGN_IN_SUCCESS]: {
    ko: '로그인 성공',
    en: 'Signed in successfully.',
  },
  [AUTH_SIGN_OUT_SUCCESS]: {
    ko: '로그아웃 완료',
    en: 'Signed out successfully.',
  },
  [BASE_DATA_INIT_SUCCESS]: {
    ko: '기본 데이터 초기화 완료',
    en: 'Base data initialization completed.',
  },
  [BASE_DATA_API_SHAPE_MISMATCH]: {
    ko: '서버 API 형태가 예상과 다릅니다.',
    en: 'Server API shape does not match expected contract.',
  },
  [BACKEND_PROBE_SUCCESS]: {
    ko: '백엔드 연동 성공',
    en: 'Backend integration succeeded.',
  },
  [BACKEND_PROBE_FAILED]: {
    ko: '백엔드 연동 실패',
    en: 'Backend integration failed.',
  },
} as const;

export type MessageCode = keyof typeof APP_MESSAGES;

export function t(locale: Locale, code: MessageCode): string {
  return APP_MESSAGES[code][locale];
}
