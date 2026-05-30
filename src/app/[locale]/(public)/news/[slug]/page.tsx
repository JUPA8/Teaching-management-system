export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { localizePost, slugLookup } from '@/lib/postLocale';

const TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { NEWS: 'News', UPDATE: 'Update', OFFER: 'Offer', EVENT: 'Event', ANNOUNCEMENT: 'Announcement' },
  de: { NEWS: 'Neuigkeit', UPDATE: 'Update', OFFER: 'Angebot', EVENT: 'Veranstaltung', ANNOUNCEMENT: 'Ankündigung' },
  ar: { NEWS: 'خبر', UPDATE: 'تحديث', OFFER: 'عرض', EVENT: 'حدث', ANNOUNCEMENT: 'إعلان' },
};

const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  EVENT: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-red-100 text-red-700',
};

const NAV_COPY: Record<string, { back: string; allNews: string; bookTrial: string; featured: string }> = {
  en: { back: 'Back to News', allNews: '← All News & Announcements', bookTrial: 'Book a Free Trial →', featured: 'Featured' },
  de: { back: 'Zurück zu Neuigkeiten', allNews: '← Alle Neuigkeiten & Ankündigungen', bookTrial: 'Kostenlose Probestunde buchen →', featured: 'Featured' },
  ar: { back: 'العودة إلى الأخبار', allNews: '← جميع الأخبار والإعلانات', bookTrial: 'احجز حصة تجريبية مجانية →', featured: 'مميز' },
};

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Find by any locale's slug (EN primary, DE or AR alternative)
  const post = await prisma.post.findFirst({
    where: {
      OR: slugLookup(slug),
      isPublished: true,
    },
  });

  if (!post) notFound();

  const loc    = localizePost(post, locale);
  const labels = TYPE_LABELS[locale] ?? TYPE_LABELS.en;
  const nav    = NAV_COPY[locale]   ?? NAV_COPY.en;
  const isRTL  = locale === 'ar';

  const date = post.publishedAt ?? post.createdAt;
  const formattedDate = new Date(date).toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : locale === 'de' ? 'de-DE' : 'en-GB',
    { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-white to-[#E8F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cover Image */}
      {post.image && (
        <div className="relative h-80 md:h-[420px] overflow-hidden">
          <img src={post.image} alt={loc.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 text-[#2B7A78] font-semibold text-sm mb-8 hover:gap-3 transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {nav.back}
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-700'}`}>
            {labels[post.type] || post.type}
          </span>
          {post.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
              {nav.featured}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {loc.title}
        </h1>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-8">{formattedDate}</p>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-[#2B7A78]/30 via-[#D9B574]/50 to-[#2B7A78]/30 mb-8" />

        {/* Excerpt */}
        {loc.excerpt && (
          <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed border-l-4 border-[#D9B574] pl-5">
            {loc.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          {loc.content.split('\n').map((para: string, i: number) =>
            para.trim() ? (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
            ) : (
              <br key={i} />
            )
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 text-[#2B7A78] font-semibold hover:gap-3 transition-all"
            >
              {nav.allNews}
            </Link>
            <Link
              href={`/${locale}/probestunde`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              {nav.bookTrial}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
