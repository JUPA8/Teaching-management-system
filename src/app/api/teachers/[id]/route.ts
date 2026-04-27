export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({
  bio: z.string().max(2000).optional(),
  specializations: z.array(z.string().max(100)).optional(),
  languages: z.array(z.string().max(50)).optional(),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  isActive: z.boolean().optional(),
});

// PATCH /api/teachers/[id] — Admin only: update teacher profile fields
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

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
    }

    const updated = await prisma.teacher.update({
      where: { id: params.id },
      data: validation.data,
      select: {
        id: true,
        bio: true,
        gender: true,
        specializations: true,
        languages: true,
        yearsExperience: true,
        isActive: true,
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update teacher' },
      { status }
    );
  }
}
