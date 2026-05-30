export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'] as const;

const multilingualText = (max = 10000) => z.string().max(max).optional().or(z.literal(''));

const updatePostSchema = z.object({
  // English
  title:   z.string().min(1).max(300).optional(),
  slug:    z.string().min(1).max(300).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(1).optional(),
  // German
  titleDe:   multilingualText(300),
  slugDe:    z.string().max(300).regex(/^[a-z0-9-]*$/).optional().or(z.literal('')),
  excerptDe: multilingualText(500),
  contentDe: multilingualText(),
  // Arabic
  titleAr:   multilingualText(300),
  slugAr:    z.string().max(300).regex(/^[a-zA-Z0-9-]*$/).optional().or(z.literal('')),
  excerptAr: multilingualText(500),
  contentAr: multilingualText(),
  // Common
  image:       z.string().url().optional().or(z.literal('')),
  type:        z.enum(POST_TYPES).optional(),
  featured:    z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder:   z.number().int().min(0).optional(),
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

    const d = validation.data;

    // Slug uniqueness checks
    if (d.slug && d.slug !== existing.slug) {
      const conflict = await prisma.post.findUnique({ where: { slug: d.slug } });
      if (conflict) return NextResponse.json({ success: false, error: 'A post with this slug already exists.' }, { status: 409 });
    }
    const slugDeVal = d.slugDe !== undefined ? (d.slugDe?.trim() || null) : undefined;
    if (slugDeVal && slugDeVal !== existing.slugDe) {
      const conflict = await prisma.post.findUnique({ where: { slugDe: slugDeVal } });
      if (conflict) return NextResponse.json({ success: false, error: 'German slug already used.' }, { status: 409 });
    }
    const slugArVal = d.slugAr !== undefined ? (d.slugAr?.trim() || null) : undefined;
    if (slugArVal && slugArVal !== existing.slugAr) {
      const conflict = await prisma.post.findUnique({ where: { slugAr: slugArVal } });
      if (conflict) return NextResponse.json({ success: false, error: 'Arabic slug already used.' }, { status: 409 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(d.title     !== undefined && { title:     d.title }),
        ...(d.slug      !== undefined && { slug:      d.slug }),
        ...(d.excerpt   !== undefined && { excerpt:   d.excerpt || null }),
        ...(d.content   !== undefined && { content:   d.content }),
        ...(d.titleDe   !== undefined && { titleDe:   d.titleDe?.trim() || null }),
        ...(slugDeVal   !== undefined && { slugDe:    slugDeVal }),
        ...(d.excerptDe !== undefined && { excerptDe: d.excerptDe?.trim() || null }),
        ...(d.contentDe !== undefined && { contentDe: d.contentDe?.trim() || null }),
        ...(d.titleAr   !== undefined && { titleAr:   d.titleAr?.trim() || null }),
        ...(slugArVal   !== undefined && { slugAr:    slugArVal }),
        ...(d.excerptAr !== undefined && { excerptAr: d.excerptAr?.trim() || null }),
        ...(d.contentAr !== undefined && { contentAr: d.contentAr?.trim() || null }),
        ...(d.image       !== undefined && { image:       d.image || null }),
        ...(d.type        !== undefined && { type:        d.type }),
        ...(d.featured    !== undefined && { featured:    d.featured }),
        ...(d.isPublished !== undefined && { isPublished: d.isPublished }),
        ...(d.sortOrder   !== undefined && { sortOrder:   d.sortOrder }),
        ...(d.publishedAt !== undefined && { publishedAt: d.publishedAt ? new Date(d.publishedAt) : null }),
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

// DELETE /api/posts/[id] — Admin only
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
