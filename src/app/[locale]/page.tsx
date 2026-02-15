import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CoursesSection from '@/components/CoursesSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import IslamicDivider from '@/components/IslamicDivider';

export default function HomePage() {
  return (
    <>
      <Hero />
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
