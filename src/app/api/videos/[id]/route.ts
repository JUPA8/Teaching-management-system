export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  duration: z.string().max(10).optional(),
  views: z.number().int().min(0).optional(),
  category: z.enum(['quran', 'tajweed', 'arabic', 'islamic']).optional(),
  image: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// PATCH /api/videos/[id] — Admin only: update video
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({ where: { id: params.id } });
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    const data = validation.data;
    const updateData: any = { ...data };
    if ('image' in data) updateData.image = data.image || null;
    if ('videoUrl' in data) updateData.videoUrl = data.videoUrl || null;

    const updated = await prisma.video.update({ where: { id: params.id }, data: updateData });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating video:', error);
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update video' },
      { status }
    );
  }
}

// DELETE /api/videos/[id] — Admin only: delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const video = await prisma.video.findUnique({ where: { id: params.id } });
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    await prisma.video.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete video' },
      { status }
    );
  }
}
