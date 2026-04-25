import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const patchSchema = z.object({
  isContacted: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();

    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { isContacted } = validation.data;

    const updated = await prisma.probestundeRequest.update({
      where: { id },
      data: {
        isContacted,
        contactedAt: isContacted ? new Date() : null,
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
