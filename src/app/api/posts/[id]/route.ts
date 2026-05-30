export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'] as const;

const updatePostSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(1).optional(),
  image: z.string().url().optional().or(z.literal('')),
  type: z.enum(POST_TYPES).optional(),
  featured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
});

// PATCH /api/posts/[id] — Admin only: update a post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness if slug is being changed
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await prisma.post.findUnique({ where: { slug: data.slug } });
      if (slugConflict) {
        return NextResponse.json({ success: false, error: 'A post with this slug already exists.' }, { status: 409 });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt || null }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.publishedAt !== undefined && {
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        }),
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update post';
    console.error('Error updating post:', error);
    const status = msg.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

// DELETE /api/posts/[id] — Admin only: delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete post';
    console.error('Error deleting post:', error);
    const status = msg.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
