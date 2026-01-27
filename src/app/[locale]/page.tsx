import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CoursesSection from '@/components/CoursesSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CoursesSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
