import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { localizePost } from '@/lib/postLocale';

async function getFeaturedBanner() {
  try {
    return await prisma.post.findFirst({
      where: {
        isPublished: true,
        featured: true,
        type: { in: ['OFFER', 'ANNOUNCEMENT'] },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true, slug: true, excerpt: true, content: true,
        titleDe: true, slugDe: true, excerptDe: true, contentDe: true,
        titleAr: true, slugAr: true, excerptAr: true, contentAr: true,
        type: true,
      },
    });
  } catch {
    return null;
  }
}

const TYPE_CONFIG: Record<string, { icon: string; label: Record<string, string>; pill: string }> = {
  OFFER:        { icon: '🎉', label: { en: 'Special Offer', de: 'Sonderangebot', ar: 'عرض خاص' },   pill: 'bg-[#D9B574] text-white' },
  ANNOUNCEMENT: { icon: '📢', label: { en: 'Announcement', de: 'Ankündigung',   ar: 'إعلان' }, pill: 'bg-white/20 text-white border border-white/40' },
};

const READ_MORE: Record<string, string> = { en: 'Read More', de: 'Mehr lesen', ar: 'اقرأ المزيد' };

export default async function AnnouncementBanner({ locale }: { locale: string }) {
  const post = await getFeaturedBanner();
  if (!post) return null;

  const loc    = localizePost(post, locale);
  const config = TYPE_CONFIG[post.type] ?? TYPE_CONFIG.ANNOUNCEMENT;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1d5856] via-[#2B7A78] to-[#1d5856]">
      {/* Islamic geometric background pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D9B574' stroke-width='1'%3E%3Cpath d='M40 10 L55 25 L55 55 L40 70 L25 55 L25 25 Z'/%3E%3Cpath d='M40 20 L50 30 L50 50 L40 60 L30 50 L30 30 Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D9B574] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: icon + text */}
          <div className="flex items-start sm:items-center gap-4 text-center sm:text-left">
            <span className="text-3xl flex-shrink-0 hidden sm:block">{config.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="text-xl sm:hidden">{config.icon}</span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${config.pill}`}>
                  {config.label[locale] ?? config.label.en}
                </span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl leading-snug">
                {loc.title}
              </p>
              {loc.excerpt && (
                <p className="text-white/75 text-sm mt-0.5 max-w-xl">
                  {loc.excerpt}
                </p>
              )}
            </div>
          </div>

          {/* Right: CTA button */}
          <Link
            href={`/${locale}/news/${loc.slug}`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#D9B574] hover:bg-[#C4A565] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap"
          >
            {READ_MORE[locale] ?? READ_MORE.en}
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>

      {/* Gold bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D9B574] to-transparent" />
    </div>
  );
}
