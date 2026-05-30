export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Post } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin, isAdmin } from '@/lib/auth-helpers';
import { localizePost } from '@/lib/postLocale';

const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'] as const;

const multilingualText = (max = 10000) => z.string().max(max).optional().or(z.literal(''));
const slug300 = z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only');

const createPostSchema = z.object({
  // English (required)
  title:   z.string().min(1).max(300),
  slug:    slug300,
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(1),
  // German (optional)
  titleDe:   multilingualText(300),
  slugDe:    z.string().max(300).regex(/^[a-z0-9-]*$/).optional().or(z.literal('')),
  excerptDe: multilingualText(500),
  contentDe: multilingualText(),
  // Arabic (optional)
  titleAr:   multilingualText(300),
  slugAr:    z.string().max(300).regex(/^[a-zA-Z0-9-]*$/).optional().or(z.literal('')),
  excerptAr: multilingualText(500),
  contentAr: multilingualText(),
  // Common
  image:       z.string().url().optional().or(z.literal('')),
  type:        z.enum(POST_TYPES),
  featured:    z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder:   z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
});

// GET /api/posts — Public: returns published posts. Admin: ?includeAll=true returns all.
// ?locale=en|de|ar — returns localized computed fields (title/slug/excerpt/content)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type        = searchParams.get('type');
    const featured    = searchParams.get('featured');
    const limitParam  = searchParams.get('limit');
    const includeAll  = searchParams.get('includeAll') === 'true';
    const locale      = searchParams.get('locale') ?? 'en';
    const limit       = limitParam ? Math.min(parseInt(limitParam) || 20, 100) : undefined;

    const adminUser = includeAll ? await isAdmin() : false;
    const whereClause: {
      isPublished?: boolean;
      type?: string;
      featured?: boolean;
    } = adminUser ? {} : { isPublished: true };
    if (type && type !== 'all' && POST_TYPES.includes(type as typeof POST_TYPES[number])) {
      whereClause.type = type;
    }
    if (featured === 'true') whereClause.featured = true;

    const posts: Post[] = await prisma.post.findMany({
      where: whereClause,
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });

    // For admin (includeAll) return raw multilingual fields.
    // For public consumers, return localized computed fields merged onto the post.
    const data = adminUser
      ? posts
      : posts.map((p: Post) => {
          const loc = localizePost(p, locale);
          return { ...p, ...loc };
        });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch posts';
    console.error('Error fetching posts:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST /api/posts — Admin only: create a new post
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const d = validation.data;

    // Check English slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug: d.slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A post with this slug already exists.' }, { status: 409 });
    }

    // Check DE slug uniqueness if provided
    const slugDeVal = d.slugDe?.trim() || null;
    if (slugDeVal) {
      const deConflict = await prisma.post.findUnique({ where: { slugDe: slugDeVal } });
      if (deConflict) return NextResponse.json({ success: false, error: 'German slug already used.' }, { status: 409 });
    }

    // Check AR slug uniqueness if provided
    const slugArVal = d.slugAr?.trim() || null;
    if (slugArVal) {
      const arConflict = await prisma.post.findUnique({ where: { slugAr: slugArVal } });
      if (arConflict) return NextResponse.json({ success: false, error: 'Arabic slug already used.' }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        title:     d.title,
        slug:      d.slug,
        excerpt:   d.excerpt || null,
        content:   d.content,
        titleDe:   d.titleDe?.trim() || null,
        slugDe:    slugDeVal,
        excerptDe: d.excerptDe?.trim() || null,
        contentDe: d.contentDe?.trim() || null,
        titleAr:   d.titleAr?.trim() || null,
        slugAr:    slugArVal,
        excerptAr: d.excerptAr?.trim() || null,
        contentAr: d.contentAr?.trim() || null,
        image:       d.image || null,
        type:        d.type,
        featured:    d.featured ?? false,
        isPublished: d.isPublished ?? true,
        sortOrder:   d.sortOrder ?? 0,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create post';
    console.error('Error creating post:', error);
    const status = msg.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
