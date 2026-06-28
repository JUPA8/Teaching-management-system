import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('privacy')} — Salam Institut`,
    description: 'Privacy Policy of Salam Institut — how we collect, use, and protect your personal data.',
    robots: { index: false },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#F9F4E8] py-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#3B6F5F] hover:text-[#C9A24D] transition-colors mb-8 text-sm font-medium">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#2A2A2A] mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">1. Controller</h2>
            <p>
              Salam Institut is the controller responsible for your personal data processed through
              this website and our online learning platform. Contact us at{' '}
              <a href="mailto:info@salam-institut.com" className="text-[#3B6F5F] underline">
                info@salam-institut.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> name, email address, role (student/teacher).</li>
              <li><strong>Profile data:</strong> phone number, date of birth (for student profiles), language preferences.</li>
              <li><strong>Usage data:</strong> bookings, attendance records, grades, course progress.</li>
              <li><strong>Technical data:</strong> IP address (for rate limiting only), browser type, session tokens.</li>
              <li><strong>Payment data:</strong> handled exclusively by Stripe — we never store card numbers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">3. Purpose and Legal Basis</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and managing online courses (performance of contract, Art. 6(1)(b) GDPR).</li>
              <li>Sending account verification and password-reset emails (legitimate interest, Art. 6(1)(f) GDPR).</li>
              <li>Processing payments via Stripe (performance of contract).</li>
              <li>Security and fraud prevention (legitimate interest).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">4. Data Sharing</h2>
            <p>We share your data only with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Neon (PostgreSQL):</strong> cloud database provider (EU-US data processing agreement).</li>
              <li><strong>Stripe:</strong> payment processor (PCI-DSS certified).</li>
              <li><strong>AWS S3:</strong> file storage for uploaded content.</li>
              <li><strong>Vercel:</strong> hosting platform.</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">5. Data Retention</h2>
            <p>
              Account data is retained for as long as your account is active or as needed to provide
              services. You may request deletion at any time by contacting us. Payment records are
              retained for 7 years as required by German tax law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">6. Your Rights (GDPR)</h2>
            <p>Under GDPR you have the right to: access, rectify, erase, restrict processing of, and
              port your personal data. You also have the right to object to processing and to lodge a
              complaint with your local supervisory authority.</p>
            <p className="mt-2">
              Contact us at{' '}
              <a href="mailto:info@salam-institut.com" className="text-[#3B6F5F] underline">
                info@salam-institut.com
              </a>{' '}
              to exercise any of these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">7. Cookies</h2>
            <p>
              We use only essential session cookies required for authentication (NextAuth.js).
              No tracking or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">8. Contact</h2>
            <p>
              For privacy inquiries:{' '}
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
