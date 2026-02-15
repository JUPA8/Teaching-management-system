import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentUser, requireAnyRole } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const createBookingSchema = z.object({
  courseId: z.string().cuid(),
  studentId: z.string().cuid(),
  teacherId: z.string().cuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
});

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

    // Role-based filtering
    if (user.role === UserRole.STUDENT) {
      // Students can only see their own bookings
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });
      if (!student) {
        return NextResponse.json(
          { success: false, error: 'Student profile not found' },
          { status: 404 }
        );
      }
      where.studentId = student.id;
    } else if (user.role === UserRole.TEACHER) {
      // Teachers can only see their own bookings
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (!teacher) {
        return NextResponse.json(
          { success: false, error: 'Teacher profile not found' },
          { status: 404 }
        );
      }
      where.teacherId = teacher.id;
    } else {
      // Admins can filter by studentId or teacherId
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
          course: {
            select: {
              id: true,
              name: true,
              type: true,
              duration: true,
            },
          },
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Calculate end time
    const scheduledAt = new Date(data.scheduledAt);
    const endTime = new Date(scheduledAt.getTime() + course.duration * 60000);

    // Check for teacher conflicts
    const teacherConflict = await prisma.booking.findFirst({
      where: {
        teacherId: data.teacherId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { scheduledAt: { lte: scheduledAt } },
              { endTime: { gt: scheduledAt } },
            ],
          },
          {
            AND: [
              { scheduledAt: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (teacherConflict) {
      return NextResponse.json(
        { success: false, error: 'Teacher is not available at this time' },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        courseId: data.courseId,
        studentId: data.studentId,
        teacherId: data.teacherId,
        scheduledAt,
        endTime,
        notes: data.notes,
        status: user.role === UserRole.ADMIN ? 'CONFIRMED' : 'PENDING',
      },
      include: {
        course: true,
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
