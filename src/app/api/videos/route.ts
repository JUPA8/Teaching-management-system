export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin, isAdmin } from '@/lib/auth-helpers';

const createVideoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  duration: z.string().max(10),
  views: z.number().int().min(0).optional(),
  category: z.enum(['quran', 'tajweed', 'arabic', 'islamic']),
  image: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// GET /api/videos — Public: returns active videos. Admin: ?includeInactive=true returns all.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const adminUser = includeInactive ? await isAdmin() : false;
    const where: any = adminUser ? {} : { isActive: true };
    if (category && category !== 'all') where.category = category;

    const videos = await prisma.video.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: videos });
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos — Admin only: create a new video
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = createVideoSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        views: data.views ?? 0,
        category: data.category,
        image: data.image || null,
        videoUrl: data.videoUrl || null,
        featured: data.featured ?? false,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating video:', error);
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create video' },
      { status }
    );
  }
}
