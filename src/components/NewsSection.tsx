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

const TYPE_COLORS: Record<string, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  EVENT: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-red-100 text-red-700',
};

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        type: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function NewsSection({ locale }: { locale: string }) {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#F5F0E8] via-white to-[#E8F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D9B574]" />
            <span className="text-[#D9B574] font-semibold text-sm uppercase tracking-widest">Stay Informed</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D9B574]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest{' '}
            <span className="bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent">
              News & Announcements
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay up to date with our latest courses, events, offers, and institute updates.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'image' | 'type' | 'publishedAt' | 'createdAt'>) => {
            const date = post.publishedAt ?? post.createdAt;
            const formattedDate = new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
              >
                {/* Image */}
                {post.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#2B7A78]/10 to-[#D9B574]/10 flex items-center justify-center">
                    <span className="text-5xl opacity-30">📰</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-700'}`}>
                      {TYPE_LABELS[post.type] || post.type}
                    </span>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2B7A78] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <Link
                      href={`/${locale}/news/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[#2B7A78] font-semibold text-sm hover:gap-3 transition-all group/link"
                    >
                      Read More
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            View All Posts
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
