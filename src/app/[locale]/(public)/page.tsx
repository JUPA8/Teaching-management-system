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
      <AnnouncementBanner locale={locale} />
      <Hero />
      <IslamicDivider />
      <Features />
      <IslamicDivider />
      <CoursesSection />
      <IslamicDivider />
      <NewsSection locale={locale} />
      <IslamicDivider />
      <Testimonials />
      <IslamicDivider />
      <CTASection />
    </>
  );
}
