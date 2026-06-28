import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('terms')} — Salam Institut`,
    description: 'Terms of Service for Salam Institut online Quran, Arabic, and Islamic studies courses.',
    robots: { index: false },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#F9F4E8] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#3B6F5F] hover:text-[#C9A24D] transition-colors mb-8 text-sm font-medium">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#2A2A2A] mb-3">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">1. Acceptance</h2>
            <p>
              By registering for or using the services of Salam Institut, you agree to these Terms
              of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">2. Services</h2>
            <p>
              Salam Institut provides online lessons in Quran recitation, Tajweed, Arabic language,
              and Islamic studies conducted via video call (Zoom / Google Meet). Course details,
              pricing, and scheduling are shown on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">3. Bookings and Cancellations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bookings are confirmed upon payment or admin approval.</li>
              <li>Cancellations made more than 24 hours before the session are eligible for a full refund or rescheduling.</li>
              <li>No-shows or late cancellations (less than 24 hours) are not refundable.</li>
              <li>We reserve the right to cancel or reschedule sessions due to teacher unavailability, with prior notice to the student.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">4. Payments</h2>
            <p>
              Payments are processed securely via Stripe. All prices are in EUR and include applicable
              taxes where required. We do not store payment card details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">5. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must provide accurate information during registration.</li>
              <li>Accounts may be suspended for violation of these terms or abusive behaviour.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">6. Intellectual Property</h2>
            <p>
              All course materials, recordings, and content provided by Salam Institut teachers are
              protected by copyright. You may not reproduce, share, or sell them without written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">7. Limitation of Liability</h2>
            <p>
              Salam Institut is not liable for indirect or consequential damages arising from use of
              the platform. Our total liability is limited to the amount paid by you in the 30 days
              preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">8. Governing Law</h2>
            <p>
              These terms are governed by German law. Disputes shall be submitted to the competent
              courts in Germany.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">9. Contact</h2>
            <p>
              Questions about these terms:{' '}
              <a href="mailto:info@salam-institut.com" className="text-[#3B6F5F] underline">
                info@salam-institut.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
