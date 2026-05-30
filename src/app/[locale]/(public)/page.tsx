import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CoursesSection from '@/components/CoursesSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import IslamicDivider from '@/components/IslamicDivider';
import NewsSection from '@/components/NewsSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';

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
