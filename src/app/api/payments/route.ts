import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAnyRole } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

// GET /api/payments - List payments
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Role-based filtering
    if (user.role === UserRole.STUDENT) {
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
    } else if (user.role === UserRole.ADMIN) {
      if (studentId) where.studentId = studentId;
    } else {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payments' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
