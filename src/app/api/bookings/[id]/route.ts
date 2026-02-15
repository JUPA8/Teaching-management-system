import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentUser } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  scheduledAt: z.string().datetime().optional(),
  meetingLink: z.string().url().optional(),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
  cancelReason: z.string().optional(),
});

// GET /api/bookings/[id] - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        course: true,
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (user.role === UserRole.STUDENT) {
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });
      if (booking.studentId !== student?.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      });
      if (booking.teacherId !== teacher?.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const body = await request.json();

    const validation = updateBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Prepare update data based on role
    const updateData: any = {};

    if (user.role === UserRole.ADMIN) {
      // Admins can update everything
      if (data.status) updateData.status = data.status;
      if (data.scheduledAt) {
        updateData.scheduledAt = new Date(data.scheduledAt);
        // Recalculate end time
        const course = await prisma.course.findUnique({
          where: { id: existingBooking.courseId },
        });
        if (course) {
          updateData.endTime = new Date(
            new Date(data.scheduledAt).getTime() + course.duration * 60000
          );
        }
      }
      if (data.meetingLink) updateData.meetingLink = data.meetingLink;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;
      if (data.cancelReason !== undefined) updateData.cancelReason = data.cancelReason;
      
      if (data.status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
      }
    } else if (user.role === UserRole.TEACHER) {
      // Teachers can update meeting link and notes
      if (data.meetingLink) updateData.meetingLink = data.meetingLink;
      if (data.notes !== undefined) updateData.notes = data.notes;
    } else {
      // Students can only cancel
      if (data.status === 'CANCELLED') {
        updateData.status = 'CANCELLED';
        updateData.cancelledAt = new Date();
        if (data.cancelReason) updateData.cancelReason = data.cancelReason;
      } else {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
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
      message: 'Booking updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete booking (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
