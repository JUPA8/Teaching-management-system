import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StagingBanner from '@/components/StagingBanner';
import ConditionalFloatingActions from '@/components/ConditionalFloatingActions';

export const metadata: Metadata = {
  title: 'Salam Institute - Learn Quran Online',
  description:
    'Salam Institute offers online lessons in Quran, Arabic, and Islamic studies for all ages with qualified teachers.',
  keywords: [
    'Quran',
    'Learn Quran',
    'Online Quran',
    'Tajweed',
    'Arabic',
    'Islamic Studies',
    'Hifz',
  ],
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

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Determine RTL direction
  const isRTL = locale === 'ar';

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={isRTL ? 'font-arabic' : 'font-sans'}>
        <NextIntlClientProvider messages={messages}>
          <StagingBanner />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ConditionalFloatingActions />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
