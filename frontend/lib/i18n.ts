import { SUPPORTED_LOCALES, type Locale } from '@simsasukgo/shared';

export const DEFAULT_LOCALE: Locale = 'ko';

const PRIMARY_LOCALE_INDEX = 0;
const ACCEPT_LANGUAGE_PRIMARY_INDEX = 0;

function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(languageTag?: string | null): Locale {
  if (!languageTag) {
    return DEFAULT_LOCALE;
  }

  const normalized = languageTag.toLowerCase();
  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  const primaryLocale = normalized.split('-')[PRIMARY_LOCALE_INDEX] ?? '';
  if (isSupportedLocale(primaryLocale)) {
    return primaryLocale;
  }

  return DEFAULT_LOCALE;
}

export function resolveLocaleFromAcceptLanguage(acceptLanguageHeader?: string | null): Locale {
  if (!acceptLanguageHeader) {
    return DEFAULT_LOCALE;
  }

  const firstSegment = acceptLanguageHeader.split(',')[ACCEPT_LANGUAGE_PRIMARY_INDEX] ?? '';
  const languageTag = firstSegment.split(';')[PRIMARY_LOCALE_INDEX]?.trim() ?? '';
  return resolveLocale(languageTag);
}
