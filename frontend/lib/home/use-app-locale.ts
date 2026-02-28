'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@simsasukgo/shared';
import { DEFAULT_LOCALE, resolveLocale } from '../i18n';

export function useAppLocale(initialLocale: Locale = DEFAULT_LOCALE): Locale {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const nextLocale = resolveLocale(window.navigator.language);
    setLocale(nextLocale);
  }, [initialLocale]);

  return locale;
}
