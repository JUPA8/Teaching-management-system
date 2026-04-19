export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const upsertSchema = z.object({
  bookingId: z.string().cuid(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  notes: z.string().max(1000).optional(),
});

// GET /api/attendance
// TEACHER: their own records filtered by teacherId
// STUDENT: their own records
// ADMIN: all, filterable by studentId / teacherId
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const bookingId = searchParams.get('bookingId');

    const where: Record<string, unknown> = {};

    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher) return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
      where.teacherId = teacher.id;
      if (studentId) where.studentId = studentId;
    } else if (user.role === UserRole.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!student) return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
      where.studentId = student.id;
    } else {
      if (studentId) where.studentId = studentId;
      if (teacherId) where.teacherId = teacherId;
    }

    if (bookingId) where.bookingId = bookingId;

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { markedAt: 'desc' },
      include: {
        booking: { select: { scheduledAt: true, status: true, course: { select: { name: true } } } },
        student: { include: { user: { select: { name: true, email: true } } } },
        teacher: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch attendance' }, { status });
  }
}

// POST /api/attendance — upsert (create or update) for a booking
// TEACHER only, must own the booking
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden: only teachers may mark attendance' }, { status: 403 });
    }

    const body = await request.json();
    const validation = upsertSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.error.issues }, { status: 400 });
    }

    const { bookingId, status, notes } = validation.data;

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, teacherId: true, studentId: true },
    });
    if (!booking) return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });

    // Ownership check for teacher
    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher || booking.teacherId !== teacher.id) {
        return NextResponse.json({ success: false, error: 'Forbidden: booking does not belong to you' }, { status: 403 });
      }
    }

    // Upsert attendance record
    const record = await prisma.attendance.upsert({
      where: { bookingId },
      create: {
        bookingId,
        studentId: booking.studentId,
        teacherId: booking.teacherId,
        status,
        notes,
      },
      update: { status, notes, updatedAt: new Date() },
      include: {
        booking: { select: { scheduledAt: true, course: { select: { name: true } } } },
        student: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to save attendance' }, { status });
  }
}
