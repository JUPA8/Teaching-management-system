export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin, getCurrentUser } from '@/lib/auth-helpers';
import { validatePassword } from '@/lib/validation';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  phone: z.string().optional(),
  password: z.string().min(8).optional(),
});

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Users can view their own profile, admins can view anyone
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Admins get full nested data; non-admins get only their own profile fields
    // (bookings/payments have dedicated scoped endpoints)
    const isAdmin = currentUser.role === 'ADMIN';

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Only admins receive nested booking/payment history here.
        // Non-admins query their own records through /api/bookings and /api/payments.
        teacher: isAdmin
          ? {
              select: {
                id: true,
                bio: true,
                gender: true,
                specializations: true,
                languages: true,
                hourlyRate: true,
                isActive: true,
                bookings: {
                  take: 5,
                  orderBy: { scheduledAt: 'desc' },
                  select: { id: true, scheduledAt: true, status: true, studentId: true },
                },
              },
            }
          : { select: { id: true, bio: true, gender: true, specializations: true, languages: true, isActive: true } },
        student: isAdmin
          ? {
              select: {
                id: true,
                bookings: {
                  take: 5,
                  orderBy: { scheduledAt: 'desc' },
                  select: { id: true, scheduledAt: true, status: true, teacherId: true },
                },
                payments: {
                  take: 5,
                  orderBy: { createdAt: 'desc' },
                  select: { id: true, amount: true, status: true, createdAt: true },
                },
              },
            }
          : { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Users can update their own profile, admins can update anyone
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Prepare update data
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    
    // Only admins can change roles
    if (data.role && currentUser.role === 'ADMIN') {
      updateData.role = data.role;
    }

    // Validate and hash password if provided (12 rounds, consistent with registration)
    if (data.password) {
      const pwCheck = validatePassword(data.password);
      if (!pwCheck.isValid) {
        return NextResponse.json(
          { success: false, error: 'Password does not meet requirements', failedRules: pwCheck.failedRules },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;

    // Block deletion if user has any bookings (as teacher or student)
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        teacher: { select: { id: true, _count: { select: { bookings: true } } } },
        student: { select: { id: true, _count: { select: { bookings: true } } } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const teacherBookings = user.teacher?._count?.bookings ?? 0;
    const studentBookings = user.student?._count?.bookings ?? 0;

    if (teacherBookings > 0 || studentBookings > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete user: they have ${teacherBookings + studentBookings} booking(s). Cancel or reassign bookings first.`,
        },
        { status: 409 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
