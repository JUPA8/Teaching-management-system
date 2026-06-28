import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CoursesSection from '@/components/CoursesSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import IslamicDivider from '@/components/IslamicDivider';
import NewsSection from '@/components/NewsSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const BASE_URL = 'https://salam-institut.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`;
  return {
    title: 'Salam Institut — Online Quran, Arabisch & Islamische Studien',
    description:
      'Lernen Sie Quran, Tajweed, Arabisch und Islamische Studien online mit qualifizierten Lehrern. Kostenlose Probestunde verfügbar.',
    alternates: { canonical },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* Featured offer/announcement banner — prominent, full-width, right below header */}
      <AnnouncementBanner locale={locale} />

      <Hero />

      {/* News section immediately after hero — high-visibility position */}
      <NewsSection locale={locale} />

      <IslamicDivider />
      <Features />
      <IslamicDivider />
      <CoursesSection />
      <IslamicDivider />
      <Testimonials />
      <IslamicDivider />
      <CTASection />
    </>
  );
}
