export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin, isAdmin } from '@/lib/auth-helpers';

const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'] as const;

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  type: z.enum(POST_TYPES),
  featured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
});

// GET /api/posts — Public: returns published posts. Admin: ?includeAll=true returns all.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limitParam = searchParams.get('limit');
    const includeAll = searchParams.get('includeAll') === 'true';
    const limit = limitParam ? Math.min(parseInt(limitParam) || 20, 100) : undefined;

    const adminUser = includeAll ? await isAdmin() : false;
    const where: Record<string, unknown> = adminUser ? {} : { isPublished: true };
    if (type && type !== 'all' && POST_TYPES.includes(type as typeof POST_TYPES[number])) {
      where.type = type;
    }
    if (featured === 'true') where.featured = true;

    const posts = await prisma.post.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json({ success: true, data: posts });
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

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A post with this slug already exists.' }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        image: data.image || null,
        type: data.type,
        featured: data.featured ?? false,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
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
