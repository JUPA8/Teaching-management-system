export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const patchSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
  notes: z.string().max(1000).optional(),
});

// PATCH /api/attendance/[id]
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

    // Fetch existing record
    const existing = await prisma.attendance.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Attendance record not found' }, { status: 404 });
    }

    // Ownership check for teacher
    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher || existing.teacherId !== teacher.id) {
        return NextResponse.json({ success: false, error: 'Forbidden: record does not belong to you' }, { status: 403 });
      }
    }

    const record = await prisma.attendance.update({
      where: { id },
      data: { ...validation.data, updatedAt: new Date() },
      include: {
        booking: { select: { scheduledAt: true, course: { select: { name: true } } } },
        student: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to update attendance' }, { status });
  }
}

// DELETE /api/attendance/[id]
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
    const existing = await prisma.attendance.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    await prisma.attendance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete attendance' }, { status });
  }
}
