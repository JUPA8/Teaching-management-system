export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const bulkSchema = z.object({
  resource: z.enum(['users', 'courses', 'bookings', 'teachers', 'videos', 'posts']),
  action: z.enum(['delete', 'activate', 'deactivate', 'cancel']),
  ids: z.array(z.string().min(1)).min(1).max(200),
});

/**
 * POST /api/admin/bulk
 * Body: { resource, action, ids }
 *
 * Supported combinations:
 *   users    + delete | activate | deactivate
 *   courses  + delete | activate | deactivate
 *   bookings + delete | cancel
 *   teachers + activate | deactivate
 *   videos   + delete | activate | deactivate
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { resource, action, ids } = parsed.data;

    // ── Users ─────────────────────────────────────────────────────────────────
    if (resource === 'users') {
      if (action === 'delete') {
        // Block deletion if any user has bookings (preserve data integrity)
        const withBookings = await prisma.user.findMany({
          where: {
            id: { in: ids },
            OR: [
              { student: { bookings: { some: {} } } },
              { teacher: { bookings: { some: {} } } },
            ],
          },
          select: { id: true, name: true },
        });
        if (withBookings.length > 0) {
          const names = withBookings.map((u: { id: string; name: string | null }) => u.name || u.id).join(', ');
          return NextResponse.json(
            { success: false, error: `Cannot delete users with existing bookings: ${names}` },
            { status: 409 }
          );
        }
        await prisma.user.deleteMany({ where: { id: { in: ids } } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'activate' || action === 'deactivate') {
        // Toggle isVerified as the "active" proxy for users
        await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isVerified: action === 'activate' },
        });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    // ── Courses ───────────────────────────────────────────────────────────────
    if (resource === 'courses') {
      if (action === 'delete') {
        // Block deletion for courses that have bookings
        const withBookings = await prisma.course.findMany({
          where: { id: { in: ids }, bookings: { some: {} } },
          select: { id: true, name: true, _count: { select: { bookings: true } } },
        });
        if (withBookings.length > 0) {
          const names = withBookings.map((c: { name: string; _count: { bookings: number } }) => `"${c.name}" (${c._count.bookings} bookings)`).join(', ');
          return NextResponse.json(
            { success: false, error: `Cannot delete courses with bookings: ${names}` },
            { status: 409 }
          );
        }
        await prisma.course.deleteMany({ where: { id: { in: ids } } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'activate' || action === 'deactivate') {
        await prisma.course.updateMany({
          where: { id: { in: ids } },
          data: { isActive: action === 'activate' },
        });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    // ── Bookings ──────────────────────────────────────────────────────────────
    if (resource === 'bookings') {
      if (action === 'delete') {
        await prisma.booking.deleteMany({ where: { id: { in: ids } } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'cancel') {
        await prisma.booking.updateMany({
          where: { id: { in: ids } },
          data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    // ── Teachers ──────────────────────────────────────────────────────────────
    if (resource === 'teachers') {
      if (action === 'activate' || action === 'deactivate') {
        await prisma.teacher.updateMany({
          where: { id: { in: ids } },
          data: { isActive: action === 'activate' },
        });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    // ── Videos ────────────────────────────────────────────────────────────────
    if (resource === 'videos') {
      if (action === 'delete') {
        await prisma.video.deleteMany({ where: { id: { in: ids } } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'activate' || action === 'deactivate') {
        await prisma.video.updateMany({
          where: { id: { in: ids } },
          data: { isActive: action === 'activate' },
        });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    // ── Posts ─────────────────────────────────────────────────────────────────
    if (resource === 'posts') {
      if (action === 'delete') {
        await prisma.post.deleteMany({ where: { id: { in: ids } } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'activate') {
        await prisma.post.updateMany({ where: { id: { in: ids } }, data: { isPublished: true } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
      if (action === 'deactivate') {
        await prisma.post.updateMany({ where: { id: { in: ids } }, data: { isPublished: false } });
        return NextResponse.json({ success: true, affected: ids.length });
      }
    }

    return NextResponse.json(
      { success: false, error: `Action "${action}" is not supported for resource "${resource}"` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Bulk action error:', error);
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Bulk action failed' },
      { status }
    );
  }
}
