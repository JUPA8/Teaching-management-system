export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAnyRole } from '@/lib/auth-helpers';
import { UserRole, Prisma } from '@prisma/client';
import crypto from 'crypto';

const createBookingSchema = z.object({
  courseId: z.string().cuid(),
  // Single student (original behaviour)
  studentId: z.string().cuid().optional(),
  // Bulk: array of studentIds (admin-only)
  studentIds: z.array(z.string().cuid()).optional(),
  teacherId: z.string().cuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
  // Recurring: how many additional weekly sessions to generate (0 = single)
  recurrenceWeeks: z.number().int().min(0).max(52).optional(),
});

// Custom error thrown inside the transaction to produce a 409 response
class BookingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingConflictError';
  }
}

// GET /api/bookings - List bookings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (user.role === UserRole.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      if (!student) return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
      where.studentId = student.id;
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher) return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
      where.teacherId = teacher.id;
    } else {
      if (studentId) where.studentId = studentId;
      if (teacherId) where.teacherId = teacherId;
    }

    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
        include: {
          course: { select: { id: true, name: true, type: true, duration: true } },
          student: { include: { user: { select: { id: true, name: true, email: true } } } },
          teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}

// POST /api/bookings - Create booking(s)
// Supports:
//   - Single booking:   { studentId, ... }
//   - Bulk booking:     { studentIds: [...], ... }       (ADMIN only)
//   - Recurring:        { ..., recurrenceWeeks: N }      generates N+1 weekly sessions
export async function POST(request: NextRequest) {
  try {
    const user = await requireAnyRole([UserRole.ADMIN, UserRole.STUDENT]);

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const recurrenceWeeks = data.recurrenceWeeks ?? 0;

    // ── Resolve student IDs ────────────────────────────────────────────────────
    let resolvedStudentIds: string[];

    if (user.role === UserRole.STUDENT) {
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (!student) return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
      if (data.studentId && data.studentId !== student.id) {
        return NextResponse.json({ success: false, error: 'Forbidden: cannot book on behalf of another student' }, { status: 403 });
      }
      resolvedStudentIds = [student.id];
    } else {
      // ADMIN: may supply studentIds (bulk) or single studentId
      if (data.studentIds && data.studentIds.length > 0) {
        resolvedStudentIds = data.studentIds;
      } else if (data.studentId) {
        resolvedStudentIds = [data.studentId];
      } else {
        return NextResponse.json({ success: false, error: 'studentId or studentIds is required' }, { status: 400 });
      }
    }

    // ── Verify course ──────────────────────────────────────────────────────────
    const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    if (!course.isActive) return NextResponse.json({ success: false, error: 'Course is not available' }, { status: 400 });

    // ── Verify teacher ─────────────────────────────────────────────────────────
    const teacher = await prisma.teacher.findUnique({
      where: { id: data.teacherId },
      select: { id: true, isActive: true },
    });
    if (!teacher || !teacher.isActive) {
      return NextResponse.json({ success: false, error: 'Teacher not found or inactive' }, { status: 404 });
    }

    // ── Verify teacher is assigned to course ───────────────────────────────────
    const courseTeacher = await prisma.courseTeacher.findUnique({
      where: { courseId_teacherId: { courseId: data.courseId, teacherId: data.teacherId } },
    });
    if (!courseTeacher) {
      return NextResponse.json({ success: false, error: 'Teacher is not assigned to this course' }, { status: 400 });
    }

    // ── Build list of scheduled datetimes (weekly recurrence) ─────────────────
    const baseTime = new Date(data.scheduledAt);
    const sessionTimes: Date[] = [];
    for (let week = 0; week <= recurrenceWeeks; week++) {
      const t = new Date(baseTime.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      sessionTimes.push(t);
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const initialStatus = isAdmin ? 'CONFIRMED' : 'PENDING';
    const recurrenceGroupId = recurrenceWeeks > 0 ? crypto.randomUUID() : null;
    const courseDuration = course.duration;
    const courseId = data.courseId;
    const teacherId = data.teacherId;

    // ── All conflict checks AND booking creation run inside a Serializable
    //    transaction to prevent race conditions between concurrent requests.
    const created = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Check teacher + student conflicts for every session slot
        for (const start of sessionTimes) {
          const end = new Date(start.getTime() + courseDuration * 60000);
          const dateLabel = `${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

          const teacherConflict = await tx.booking.findFirst({
            where: {
              teacherId,
              status: { in: ['PENDING', 'CONFIRMED'] },
              scheduledAt: { lt: end },
              endTime: { gt: start },
            },
            select: { scheduledAt: true },
          });
          if (teacherConflict) {
            throw new BookingConflictError(`Teacher is not available on ${dateLabel}`);
          }

          for (const studentId of resolvedStudentIds) {
            const studentConflict = await tx.booking.findFirst({
              where: {
                studentId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                scheduledAt: { lt: end },
                endTime: { gt: start },
              },
              select: { scheduledAt: true },
            });
            if (studentConflict) {
              throw new BookingConflictError(`A student already has a booking on ${dateLabel}`);
            }
          }
        }

        // Create all bookings (bulk × recurrence)
        const results: any[] = [];
        for (const studentId of resolvedStudentIds) {
          for (const start of sessionTimes) {
            const end = new Date(start.getTime() + courseDuration * 60000);
            const booking = await tx.booking.create({
              data: {
                courseId,
                studentId,
                teacherId,
                scheduledAt: start,
                endTime: end,
                notes: data.notes,
                status: initialStatus,
                recurrenceGroupId,
              },
              include: {
                course: { select: { name: true } },
                student: { include: { user: { select: { name: true, email: true } } } },
                teacher: { include: { user: { select: { name: true } } } },
              },
            });
            results.push(booking);
          }
        }
        return results;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    // ── Upsert CourseEnrollment for each student ───────────────────────────────
    await Promise.all(
      resolvedStudentIds.map((sid) =>
        prisma.courseEnrollment.upsert({
          where: { courseId_studentId: { courseId, studentId: sid } },
          create: { courseId, studentId: sid, isActive: true },
          update: { isActive: true },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        data: created.length === 1 ? created[0] : created,
        message: `${created.length} booking${created.length !== 1 ? 's' : ''} created successfully`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof BookingConflictError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }
    console.error('Error creating booking:', error);
    const status = error.message?.includes('Unauthorized') ? 401 : error.message?.includes('One of') ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to create booking' }, { status });
  }
}
