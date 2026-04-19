export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const patchSchema = z.object({
  score: z.number().min(0).max(10000).optional(),
  maxScore: z.number().min(1).max(10000).optional(),
  label: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

// PATCH /api/grades/[id]
// TEACHER: must own the record, ADMIN: unrestricted
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.error.issues }, { status: 400 });
    }

    const existing = await prisma.grade.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Grade not found' }, { status: 404 });
    }

    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher || existing.teacherId !== teacher.id) {
        return NextResponse.json({ success: false, error: 'Forbidden: grade does not belong to you' }, { status: 403 });
      }
    }

    const grade = await prisma.grade.update({
      where: { id },
      data: { ...validation.data, updatedAt: new Date() },
      include: {
        student: { include: { user: { select: { name: true } } } },
        course: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, data: grade });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to update grade' }, { status });
  }
}

// DELETE /api/grades/[id]
// ADMIN only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.grade.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    await prisma.grade.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete grade' }, { status });
  }
}
