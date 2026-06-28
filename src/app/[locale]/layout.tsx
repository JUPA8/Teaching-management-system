import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthProvider from '@/components/AuthProvider';

const BASE_URL = 'https://salam-institut.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Salam Institut — Quran, Arabisch & Islamische Studien Online',
    template: '%s — Salam Institut',
  },
  description:
    'Salam Institut bietet qualifizierte Online-Unterricht in Quran, Tajweed, Arabisch und Islamische Studien für Kinder und Erwachsene weltweit.',
  keywords: [
    'Quran lernen',
    'Quran Online',
    'Tajweed',
    'Arabisch lernen',
    'Islamische Studien',
    'Quran Kinder',
    'Salam Institut',
    'Islamic Education',
    'Learn Quran Online',
    'Hifz',
    'Arabic Language',
  ],
  authors: [{ name: 'Salam Institut', url: BASE_URL }],
  creator: 'Salam Institut',
  publisher: 'Salam Institut',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'ar_SA'],
    url: BASE_URL,
    siteName: 'Salam Institut',
    title: 'Salam Institut — Quran, Arabisch & Islamische Studien Online',
    description:
      'Qualifizierte Lehrer für Quran, Tajweed, Arabisch und Islamische Studien. Online-Unterricht weltweit.',
    images: [{ url: '/salam-institute-logo.png', width: 512, height: 512, alt: 'Salam Institut Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salam Institut — Quran & Arabisch Online lernen',
    description:
      'Qualifizierter Online-Unterricht in Quran, Tajweed, Arabisch und Islamischen Studien weltweit.',
    images: ['/salam-institute-logo.png'],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'de': `${BASE_URL}/de`,
      'en': BASE_URL,
      'ar': `${BASE_URL}/ar`,
    },
  },
};

// Generate static paths for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const isRTL = locale === 'ar';
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={isRTL ? 'font-arabic' : 'font-sans'}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
