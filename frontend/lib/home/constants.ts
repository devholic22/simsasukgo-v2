import type { Locale } from '@simsasukgo/shared';

const HOME_BACKEND_PROBE_QUERY_BY_LOCALE: Record<Locale, string> = {
  ko: '카페',
  en: 'cafe',
};

const HOME_BACKEND_PROBE_COUNT_TEMPLATE_BY_LOCALE: Record<string, string> = {
  ko: '{count}건',
  en: '{count} results',
};

const DEFAULT_BACKEND_PROBE_COUNT_TEMPLATE = '{count} results';

export const HOME_PAGE_CLASS_NAMES = {
  main: 'mx-auto min-h-screen w-full max-w-md space-y-4 px-4 py-6',
  title: 'text-2xl font-bold',
  description: 'text-sm text-slate-600',
} as const;

export type HomePageLabels = {
  pageTitle: string;
  pageDescription: string;
  authTitle: string;
  baseDataTitle: string;
  backendProbeTitle: string;
  emailLabel: string;
  passwordLabel: string;
  signUpButton: string;
  signInButton: string;
  signOutButton: string;
  initializeButton: string;
  backendProbeButton: string;
  tripTitle: string;
  preferenceTitle: string;
  currentUserPrefix: string;
  emptyValue: string;
  guestUser: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
};

const HOME_PAGE_LABELS = {
  pageTitle: {
    ko: '심사숙고 - 인증/기본 데이터',
    en: 'Simsasukgo - Auth/Base Data',
  },
  pageDescription: {
    ko: '로그인 후 Trip/UserPreference 생성 및 조회',
    en: 'Sign in and initialize/read Trip/UserPreference',
  },
  authTitle: {
    ko: '인증',
    en: 'Authentication',
  },
  baseDataTitle: {
    ko: '기본 데이터',
    en: 'Base Data',
  },
  backendProbeTitle: {
    ko: '백엔드 연동 체크',
    en: 'Backend Probe',
  },
  emailLabel: {
    ko: '이메일',
    en: 'Email',
  },
  passwordLabel: {
    ko: '비밀번호',
    en: 'Password',
  },
  signUpButton: {
    ko: '회원가입',
    en: 'Sign up',
  },
  signInButton: {
    ko: '로그인',
    en: 'Sign in',
  },
  signOutButton: {
    ko: '로그아웃',
    en: 'Sign out',
  },
  initializeButton: {
    ko: 'Trip/UserPreference 초기화',
    en: 'Initialize Trip/UserPreference',
  },
  backendProbeButton: {
    ko: '/places/search 호출 테스트',
    en: 'Test /places/search',
  },
  tripTitle: {
    ko: 'Trip',
    en: 'Trip',
  },
  preferenceTitle: {
    ko: 'UserPreference',
    en: 'UserPreference',
  },
  currentUserPrefix: {
    ko: '현재 사용자:',
    en: 'Current user:',
  },
  emptyValue: {
    ko: '없음',
    en: 'None',
  },
  guestUser: {
    ko: '미로그인',
    en: 'Guest',
  },
  emailPlaceholder: {
    ko: '이메일을 입력하세요',
    en: 'Enter your email',
  },
  passwordPlaceholder: {
    ko: '비밀번호를 입력하세요',
    en: 'Enter your password',
  },
} as const satisfies { [K in keyof HomePageLabels]: Record<Locale, string> };

export function getHomePageLabels(locale: Locale): HomePageLabels {
  return {
    pageTitle: HOME_PAGE_LABELS.pageTitle[locale],
    pageDescription: HOME_PAGE_LABELS.pageDescription[locale],
    authTitle: HOME_PAGE_LABELS.authTitle[locale],
    baseDataTitle: HOME_PAGE_LABELS.baseDataTitle[locale],
    backendProbeTitle: HOME_PAGE_LABELS.backendProbeTitle[locale],
    emailLabel: HOME_PAGE_LABELS.emailLabel[locale],
    passwordLabel: HOME_PAGE_LABELS.passwordLabel[locale],
    signUpButton: HOME_PAGE_LABELS.signUpButton[locale],
    signInButton: HOME_PAGE_LABELS.signInButton[locale],
    signOutButton: HOME_PAGE_LABELS.signOutButton[locale],
    initializeButton: HOME_PAGE_LABELS.initializeButton[locale],
    backendProbeButton: HOME_PAGE_LABELS.backendProbeButton[locale],
    tripTitle: HOME_PAGE_LABELS.tripTitle[locale],
    preferenceTitle: HOME_PAGE_LABELS.preferenceTitle[locale],
    currentUserPrefix: HOME_PAGE_LABELS.currentUserPrefix[locale],
    emptyValue: HOME_PAGE_LABELS.emptyValue[locale],
    guestUser: HOME_PAGE_LABELS.guestUser[locale],
    emailPlaceholder: HOME_PAGE_LABELS.emailPlaceholder[locale],
    passwordPlaceholder: HOME_PAGE_LABELS.passwordPlaceholder[locale],
  };
}

export function getHomeBackendProbeQuery(locale: Locale): string {
  return HOME_BACKEND_PROBE_QUERY_BY_LOCALE[locale];
}

function formatLocalizedCount(locale: string, count: number): string {
  try {
    return new Intl.NumberFormat(locale).format(count);
  } catch {
    return String(count);
  }
}

export function formatBackendProbeCount(locale: string, count: number): string {
  const template =
    HOME_BACKEND_PROBE_COUNT_TEMPLATE_BY_LOCALE[locale] ?? DEFAULT_BACKEND_PROBE_COUNT_TEMPLATE;
  const localizedCount = formatLocalizedCount(locale, count);

  return template.replace('{count}', localizedCount);
}
