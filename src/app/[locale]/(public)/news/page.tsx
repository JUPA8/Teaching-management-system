export const dynamic = 'force-dynamic';

import Link from 'next/link';
import type { Post } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { localizePost } from '@/lib/postLocale';

const TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { NEWS: 'News', UPDATE: 'Update', OFFER: 'Offer', EVENT: 'Event', ANNOUNCEMENT: 'Announcement', ALL: 'All' },
  de: { NEWS: 'Neuigkeit', UPDATE: 'Update', OFFER: 'Angebot', EVENT: 'Veranstaltung', ANNOUNCEMENT: 'Ankündigung', ALL: 'Alle' },
  ar: { NEWS: 'خبر', UPDATE: 'تحديث', OFFER: 'عرض', EVENT: 'حدث', ANNOUNCEMENT: 'إعلان', ALL: 'الكل' },
};

const PAGE_COPY: Record<string, { heading: string; subheading: string; readMore: string; noPostsTitle: string; noPostsText: string; backHome: string }> = {
  en: { heading: 'News & Announcements', subheading: 'The latest updates, offers, events, and announcements from Salam Institute.', readMore: 'Read More →', noPostsTitle: 'No posts yet', noPostsText: 'Check back soon for news and updates from Salam Institute.', backHome: '← Back to Home' },
  de: { heading: 'Neuigkeiten & Ankündigungen', subheading: 'Die neuesten Updates, Angebote, Veranstaltungen und Ankündigungen vom Salam Institut.', readMore: 'Mehr lesen →', noPostsTitle: 'Noch keine Beiträge', noPostsText: 'Schauen Sie bald wieder vorbei für Neuigkeiten vom Salam Institut.', backHome: '← Zurück zur Startseite' },
  ar: { heading: 'الأخبار والإعلانات', subheading: 'آخر التحديثات والعروض والفعاليات والإعلانات من معهد سلام.', readMore: 'اقرأ المزيد →', noPostsTitle: 'لا توجد منشورات بعد', noPostsText: 'تفقد قريبًا للأخبار والتحديثات من معهد سلام.', backHome: '← العودة إلى الرئيسية' },
};

const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  EVENT: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-red-100 text-red-700',
};

async function getAllPosts(type?: string): Promise<Post[]> {
  const where: { isPublished: boolean; type?: string } = { isPublished: true };
  if (type && type !== 'all') where.type = type;
  return prisma.post.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  const posts = await getAllPosts(type);
  const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'];
  const labels = TYPE_LABELS[locale] ?? TYPE_LABELS.en;
  const copy   = PAGE_COPY[locale]  ?? PAGE_COPY.en;
  const isRTL  = locale === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-white to-[#E8F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#D9B574]/60" />
            <span className="text-[#D9B574] font-semibold text-sm uppercase tracking-widest">Salam Institute</span>
            <div className="h-px w-12 bg-[#D9B574]/60" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{copy.heading}</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">{copy.subheading}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          <Link
            href={`/${locale}/news`}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              !type || type === 'all'
                ? 'bg-[#2B7A78] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {labels.ALL}
          </Link>
          {POST_TYPES.map((t) => (
            <Link
              key={t}
              href={`/${locale}/news?type=${t}`}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                type === t
                  ? 'bg-[#2B7A78] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {labels[t]}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">{copy.noPostsTitle}</h2>
            <p className="text-gray-500">{copy.noPostsText}</p>
            <Link
              href={`/${locale}`}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A78] text-white rounded-xl font-semibold hover:bg-[#1d5856] transition-colors"
            >
              {copy.backHome}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const loc = localizePost(post, locale);
              const date = post.publishedAt ?? post.createdAt;
              const formattedDate = new Date(date).toLocaleDateString(
                locale === 'ar' ? 'ar-EG' : locale === 'de' ? 'de-DE' : 'en-GB',
                { day: '2-digit', month: 'long', year: 'numeric' }
              );

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
                >
                  {post.image ? (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image}
                        alt={loc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-[#2B7A78]/10 to-[#D9B574]/10 flex items-center justify-center">
                      <span className="text-6xl opacity-30">📰</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-700'}`}>
                        {labels[post.type] || post.type}
                      </span>
                      <span className="text-xs text-gray-400">{formattedDate}</span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2B7A78] transition-colors line-clamp-2">
                      {loc.title}
                    </h2>

                    {loc.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {loc.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4">
                      <Link
                        href={`/${locale}/news/${loc.slug}`}
                        className="inline-flex items-center gap-2 text-[#2B7A78] font-semibold text-sm hover:gap-3 transition-all"
                      >
                        {copy.readMore}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
