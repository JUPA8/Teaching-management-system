export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

// Public GET — any page can read settings (e.g., school name, phone)
export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH — admin only, upsert one or many keys
const patchSchema = z.record(z.string(), z.string());

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid body — must be a flat key/value object' }, { status: 400 });
    }

    const updates = validation.data;

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message || 'Failed to save settings' }, { status });
  }
}
