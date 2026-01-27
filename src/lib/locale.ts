'use server';

import { cookies } from 'next/headers';

export const locales = ['en', 'de', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ar: 'العربية',
};

export const defaultLocale: Locale = 'en';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value as Locale;
  return locale && locales.includes(locale) ? locale : defaultLocale;
}

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
