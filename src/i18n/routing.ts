import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  de: '🇩🇪',
  ar: '🇸🇦',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Only show locale prefix for non-default locales
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
