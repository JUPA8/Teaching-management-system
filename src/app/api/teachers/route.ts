export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/teachers — Public: returns all active teachers with safe fields only
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        bio: true,
        gender: true,
        specializations: true,
        languages: true,
        yearsExperience: true,
        isActive: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: teachers });
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}
