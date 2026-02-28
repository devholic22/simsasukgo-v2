import { headers } from 'next/headers';
import { HomePageClient } from '../components/home/home-page-client';
import { resolveLocaleFromAcceptLanguage } from '../lib/i18n';

export default async function HomePage() {
  const requestHeaders = await headers();
  const initialLocale = resolveLocaleFromAcceptLanguage(requestHeaders.get('accept-language'));

  return <HomePageClient initialLocale={initialLocale} />;
}
