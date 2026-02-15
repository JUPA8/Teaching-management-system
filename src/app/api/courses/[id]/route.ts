import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const updateCourseSchema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().optional(),
  nameDe: z.string().optional(),
  description: z.string().min(10).optional(),
  descriptionAr: z.string().optional(),
  descriptionDe: z.string().optional(),
  type: z.enum(['QURAN_KIDS', 'QURAN_ADULTS', 'ARABIC_LANGUAGE', 'ISLAMIC_STUDIES']).optional(),
  price: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  totalSessions: z.number().int().positive().optional(),
  level: z.string().optional(),
  ageGroup: z.string().optional(),
  image: z.string().optional(),
  syllabus: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/courses/[id] - Get single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teachers: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          include: {
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
          },
        },
        _count: {
          select: {
            enrollments: true,
            bookings: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/[id] - Update course (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const validation = updateCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id },
      data: validation.data,
      include: {
        teachers: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: 'Course updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update course' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete course' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
