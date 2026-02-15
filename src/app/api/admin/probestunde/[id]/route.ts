import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();

    const updated = await prisma.probestundeRequest.update({
      where: { id },
      data: {
        isContacted: body.isContacted,
        contactedAt: body.isContacted ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating probestunde request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}
