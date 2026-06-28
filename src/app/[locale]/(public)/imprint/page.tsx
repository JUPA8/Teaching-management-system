import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('imprint')} — Salam Institut`,
    description: 'Legal imprint / Impressum of Salam Institut.',
    robots: { index: false },
  };
}

export default async function ImprintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#F9F4E8] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#3B6F5F] hover:text-[#C9A24D] transition-colors mb-8 text-sm font-medium">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#2A2A2A] mb-3">Impressum</h1>
        <p className="text-sm text-gray-500 mb-10">Legal disclosure pursuant to § 5 TMG (German Telemedia Act)</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">Provider</h2>
            <p>
              Salam Institut<br />
              Online Quran &amp; Arabic Education
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">Contact</h2>
            <p>
              Email:{' '}
              <a href="mailto:info@salam-institut.com" className="text-[#3B6F5F] underline">
                info@salam-institut.com
              </a>
              <br />
              Website:{' '}
              <a href="https://salam-institut.com" className="text-[#3B6F5F] underline">
                https://salam-institut.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">Responsibility for Content</h2>
            <p>
              The content of this website has been created with due care. However, Salam Institut
              assumes no liability for the accuracy, completeness, or topicality of the provided
              content. As a service provider, we are responsible for our own content on these pages
              in accordance with § 7 (1) TMG under general law. According to §§ 8 to 10 TMG, however,
              we are not obligated to monitor transmitted or stored third-party information or to
              investigate circumstances that indicate illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">Copyright</h2>
            <p>
              The contents and works created by the site operators on these pages are subject to
              German copyright law. Duplication, processing, distribution, or any form of
              commercialization of such material beyond the scope of the copyright law requires the
              prior written consent of its author or creator.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-3">Dispute Resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (OS):{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B6F5F] underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . We are not obligated to participate in dispute resolution proceedings before a
              consumer arbitration board.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
