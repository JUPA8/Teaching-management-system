import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const createCourseSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  nameDe: z.string().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  descriptionDe: z.string().optional(),
  type: z.enum(['QURAN_KIDS', 'QURAN_ADULTS', 'ARABIC_LANGUAGE', 'ISLAMIC_STUDIES']),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  totalSessions: z.number().int().positive(),
  level: z.string().optional(),
  ageGroup: z.string().optional(),
  image: z.string().optional(),
  syllabus: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === 'true';

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    const course = await prisma.course.create({
      data,
      include: {
        teachers: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: 'Course created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create course' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
