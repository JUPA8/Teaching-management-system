import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Post } from '@prisma/client';

const TYPE_LABELS: Record<string, string> = {
  NEWS: 'News',
  UPDATE: 'Update',
  OFFER: 'Offer',
  EVENT: 'Event',
  ANNOUNCEMENT: 'Announcement',
};

const TYPE_PILL: Record<string, string> = {
  NEWS:         'bg-blue-500/20   text-blue-200   border border-blue-400/30',
  UPDATE:       'bg-purple-500/20 text-purple-200 border border-purple-400/30',
  OFFER:        'bg-[#D9B574]/20  text-[#D9B574]  border border-[#D9B574]/40',
  EVENT:        'bg-orange-500/20 text-orange-200 border border-orange-400/30',
  ANNOUNCEMENT: 'bg-red-500/20    text-red-200    border border-red-400/30',
};

const TYPE_PILL_LIGHT: Record<string, string> = {
  NEWS:         'bg-blue-100   text-blue-700',
  UPDATE:       'bg-purple-100 text-purple-700',
  OFFER:        'bg-[#D9B574]/20 text-[#8a6a20]',
  EVENT:        'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-red-100    text-red-700',
};

async function getLatestPosts() {
  try {
    // featured posts first, then by sortOrder and date — take 4 (1 hero + 3 grid)
    return await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 4,
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date | null): string {
  return new Date(date ?? new Date()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function NewsSection({ locale }: { locale: string }) {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  const [hero, ...secondary] = posts;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a3a38] via-[#2B7A78] to-[#1d4a47]">
      {/* Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D9B574' stroke-width='1'%3E%3Cpath d='M60 10 L90 30 L90 90 L60 110 L30 90 L30 30 Z'/%3E%3Cpath d='M60 25 L80 40 L80 80 L60 95 L40 80 L40 40 Z'/%3E%3Cpath d='M60 40 L70 50 L70 70 L60 80 L50 70 L50 50 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />
      {/* Radial glow for depth */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        {/* ── Section header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#D9B574]" />
              <span className="text-[#D9B574] font-semibold text-xs uppercase tracking-[0.2em]">Stay Informed</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              News &amp;{' '}
              <span className="text-[#D9B574]">Announcements</span>
            </h2>
          </div>
          <Link
            href={`/${locale}/news`}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-[#D9B574]/50 text-[#D9B574] hover:bg-[#D9B574] hover:text-white rounded-xl font-semibold text-sm transition-all flex-shrink-0"
          >
            View All Posts →
          </Link>
        </div>

        {/* ── Featured / hero card ─────────────────────────────────────────── */}
        <Link
          href={`/${locale}/news/${hero.slug}`}
          className="group block mb-8"
        >
          <article className="rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#D9B574]/40 transition-all duration-500">
            <div className="flex flex-col md:flex-row md:min-h-[360px]">

              {/* Image panel */}
              <div className="relative md:w-[55%] min-h-[240px] md:min-h-0 overflow-hidden flex-shrink-0">
                {hero.image ? (
                  <>
                    <img
                      src={hero.image}
                      alt={hero.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/30 md:to-[#1d4a47]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78]/40 to-[#D9B574]/20 flex items-center justify-center">
                    <span className="text-8xl opacity-20">📰</span>
                  </div>
                )}
                {/* Type badge over image */}
                <div className="absolute top-5 left-5">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${TYPE_PILL[hero.type] || TYPE_PILL.NEWS}`}>
                    {TYPE_LABELS[hero.type] || hero.type}
                  </span>
                </div>
                {/* Featured star */}
                {hero.featured && (
                  <div className="absolute top-5 right-5 w-9 h-9 bg-[#D9B574] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm">★</span>
                  </div>
                )}
              </div>

              {/* Content panel */}
              <div className="flex flex-col justify-center p-8 md:p-10 md:w-[45%]">
                <div className="flex items-center gap-2 mb-4">
                  {/* Date */}
                  <span className="text-white/50 text-sm">
                    {formatDate(hero.publishedAt ?? hero.createdAt)}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4 group-hover:text-[#D9B574] transition-colors duration-300">
                  {hero.title}
                </h3>

                {hero.excerpt && (
                  <p className="text-white/70 text-base leading-relaxed mb-6 line-clamp-3">
                    {hero.excerpt}
                  </p>
                )}

                <div className="mt-auto">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9B574] hover:bg-[#C4A565] text-white font-bold rounded-xl shadow-lg transition-all text-sm group-hover:gap-3">
                    Read Full Story
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </div>
          </article>
        </Link>

        {/* ── Secondary posts grid ─────────────────────────────────────────── */}
        {secondary.length > 0 && (
          <div className={`grid gap-5 ${
            secondary.length === 1 ? 'grid-cols-1 max-w-md' :
            secondary.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {secondary.map((post: Post) => (
              <Link
                key={post.id}
                href={`/${locale}/news/${post.slug}`}
                className="group block"
              >
                <article className="h-full rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  {post.image ? (
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-[#2B7A78]/10 to-[#D9B574]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl opacity-25">📰</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${TYPE_PILL_LIGHT[post.type] || 'bg-gray-100 text-gray-700'}`}>
                        {TYPE_LABELS[post.type] || post.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#2B7A78] transition-colors">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 text-[#2B7A78] font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read More
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* ── Mobile "View All" button ─────────────────────────────────────── */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D9B574]/50 text-[#D9B574] hover:bg-[#D9B574] hover:text-white rounded-xl font-semibold text-sm transition-all"
          >
            View All Posts →
          </Link>
        </div>

        {/* ── Desktop "View All" button (below grid) ───────────────────────── */}
        {secondary.length > 0 && (
          <div className="hidden sm:flex justify-center mt-10">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-[#D9B574] border border-[#D9B574]/40 hover:border-[#D9B574] text-white font-bold rounded-xl backdrop-blur-sm transition-all hover:-translate-y-0.5 shadow-lg"
            >
              View All News &amp; Announcements →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
