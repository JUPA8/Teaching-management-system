import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getFeaturedBanner() {
  try {
    return await prisma.post.findFirst({
      where: {
        isPublished: true,
        featured: true,
        type: { in: ['OFFER', 'ANNOUNCEMENT'] },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, slug: true, excerpt: true, type: true },
    });
  } catch {
    return null;
  }
}

const TYPE_ICON: Record<string, string> = {
  OFFER: '🎉',
  ANNOUNCEMENT: '📢',
};

export default async function AnnouncementBanner({ locale }: { locale: string }) {
  const post = await getFeaturedBanner();
  if (!post) return null;

  const icon = TYPE_ICON[post.type] ?? '📢';

  return (
    <div className="bg-gradient-to-r from-[#2B7A78] via-[#1d5856] to-[#2B7A78] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold">{post.title}</span>
          {post.excerpt && (
            <span className="text-white/80 hidden sm:inline">— {post.excerpt}</span>
          )}
          <Link
            href={`/${locale}/news/${post.slug}`}
            className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#D9B574] hover:bg-[#C4A565] text-white rounded-full text-xs font-bold transition-colors ml-2"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
