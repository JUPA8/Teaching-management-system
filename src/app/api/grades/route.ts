export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const createSchema = z
  .object({
    studentId: z.string().cuid(),
    courseId: z.string().cuid(),
    bookingId: z.string().cuid().optional(),
    score: z.number().min(0).max(10),
    maxScore: z.number().min(0.1).max(10).default(10),
    label: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => d.score <= d.maxScore, {
    message: 'score must not exceed maxScore',
    path: ['score'],
  });

// GET /api/grades
// TEACHER: their own grades, filterable by studentId/courseId
// STUDENT: their own grades
// ADMIN: all, filterable by studentId/teacherId/courseId
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const courseId = searchParams.get('courseId');

    const where: Record<string, unknown> = {};

    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher) return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
      where.teacherId = teacher.id;
      if (studentId) where.studentId = studentId;
      if (courseId) where.courseId = courseId;
    } else if (user.role === UserRole.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!student) return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
      where.studentId = student.id;
      if (courseId) where.courseId = courseId;
    } else {
      if (studentId) where.studentId = studentId;
      if (teacherId) where.teacherId = teacherId;
      if (courseId) where.courseId = courseId;
    }

    const grades = await prisma.grade.findMany({
      where,
      orderBy: { gradedAt: 'desc' },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        teacher: { include: { user: { select: { name: true } } } },
        course: { select: { name: true } },
        booking: { select: { scheduledAt: true } },
      },
    });

    return NextResponse.json({ success: true, data: grades });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch grades' }, { status });
  }
}

// POST /api/grades
// TEACHER only, must own the student (via booking) or ADMIN
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden: only teachers may record grades' }, { status: 403 });
    }

    const body = await request.json();
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.error.issues }, { status: 400 });
    }

    const { studentId, courseId, bookingId, score, maxScore, label, notes } = validation.data;

    let teacherDbId: string;

    if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!teacher) return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
      teacherDbId = teacher.id;

      // If a bookingId is provided, verify it belongs to this teacher, student, and course
      if (bookingId) {
        const specificBooking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { teacherId: true, studentId: true, courseId: true, status: true },
        });
        if (
          !specificBooking ||
          specificBooking.teacherId !== teacher.id ||
          specificBooking.studentId !== studentId ||
          specificBooking.courseId !== courseId ||
          !['CONFIRMED', 'COMPLETED'].includes(specificBooking.status)
        ) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: booking not found or does not belong to you' },
            { status: 403 }
          );
        }
      } else {
        // No bookingId — verify teacher has at least one booking with this student for this course
        const bookingExists = await prisma.booking.findFirst({
          where: {
            teacherId: teacher.id,
            studentId,
            courseId,
            status: { in: ['CONFIRMED', 'COMPLETED'] },
          },
        });
        if (!bookingExists) {
          return NextResponse.json({ success: false, error: 'Forbidden: no confirmed booking with this student for this course' }, { status: 403 });
        }
      }
    } else {
      // Admin can specify teacherId in body, or we pick first teacher for that course/student
      const bodyTeacherId = body.teacherId as string | undefined;
      if (bodyTeacherId) {
        teacherDbId = bodyTeacherId;
      } else {
        const booking = await prisma.booking.findFirst({
          where: { studentId, courseId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
          select: { teacherId: true },
        });
        if (!booking) return NextResponse.json({ success: false, error: 'No booking found for this student/course' }, { status: 404 });
        teacherDbId = booking.teacherId;
      }
    }

    const gradeData = {
      studentId,
      teacherId: teacherDbId,
      courseId,
      score,
      maxScore: maxScore ?? 10,
      label: label ?? null,
      notes: notes ?? null,
    };

    const gradeInclude = {
      student: { include: { user: { select: { name: true } } } },
      course: { select: { name: true } },
    };

    let grade;
    if (bookingId) {
      // Upsert: one grade per booking session (enforced by @unique on bookingId)
      grade = await prisma.grade.upsert({
        where: { bookingId },
        create: { ...gradeData, bookingId },
        update: { score, maxScore: maxScore ?? 10, label: label ?? null, notes: notes ?? null },
        include: gradeInclude,
      });
    } else {
      grade = await prisma.grade.create({
        data: { ...gradeData, bookingId: null },
        include: gradeInclude,
      });
    }

    return NextResponse.json({ success: true, data: grade }, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to create grade' }, { status });
  }
}
