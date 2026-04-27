export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import BookingsTableClient from './BookingsTableClient';
import type { Prisma } from '@prisma/client';

type BookingRow = Prisma.BookingGetPayload<{
  include: {
    course: { select: { id: true; name: true; type: true } };
    student: { include: { user: { select: { id: true; name: true; email: true } } } };
    teacher: { include: { user: { select: { id: true; name: true; email: true } } } };
  };
}>;

export default async function AdminBookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: { page?: string; search?: string; status?: string; dateFrom?: string; dateTo?: string };
}) {
  const { locale } = await params;
  const admin = await requireAdmin().catch(() => null);
  if (!admin) redirect(`/${locale}/login`);

  const page = Math.max(1, parseInt(searchParams?.page ?? '1') || 1);
  const pageSize = 30;
  const search = searchParams?.search?.trim() || '';
  const statusFilter = searchParams?.status || '';
  const dateFrom = searchParams?.dateFrom || '';
  const dateTo = searchParams?.dateTo || '';

  const where: any = {};

  if (search) {
    where.OR = [
      { student: { user: { name: { contains: search, mode: 'insensitive' } } } },
      { teacher: { user: { name: { contains: search, mode: 'insensitive' } } } },
      { course: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (statusFilter) where.status = statusFilter;
  if (dateFrom || dateTo) {
    where.scheduledAt = {};
    if (dateFrom) where.scheduledAt.gte = new Date(dateFrom);
    if (dateTo) where.scheduledAt.lte = new Date(dateTo + 'T23:59:59');
  }

  const [bookings, totalCount]: [BookingRow[], number] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        course: { select: { id: true, name: true, type: true } },
        student: { include: { user: { select: { id: true, name: true, email: true } } } },
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Serialize dates for client component
  const serialized = bookings.map((b) => ({
    ...b,
    scheduledAt: b.scheduledAt.toISOString(),
    endTime: b.endTime.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    cancelledAt: b.cancelledAt?.toISOString() ?? null,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#D9B574] to-[#C4A565] rounded-full" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D9B574] to-[#C4A565] bg-clip-text text-transparent">
            Bookings Management
          </h1>
        </div>
        <Link href={`/${locale}/admin/bookings/create`} className="relative group overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] transform group-hover:scale-105 transition-transform" />
          <div className="relative px-6 py-3">
            <span className="text-white font-bold">+ Create Booking</span>
          </div>
        </Link>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Search</label>
          <input name="search" defaultValue={search} placeholder="Student, teacher, or course…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9B574]/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Status</label>
          <select name="status" defaultValue={statusFilter} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">From</label>
          <input type="date" name="dateFrom" defaultValue={dateFrom} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">To</label>
          <input type="date" name="dateTo" defaultValue={dateTo} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </div>
        <button type="submit" className="px-4 py-2 bg-[#2B7A78] text-white rounded-lg text-sm font-bold hover:bg-[#1d5856] transition-colors">Filter</button>
        {(search || statusFilter || dateFrom || dateTo) && (
          <Link href={`/${locale}/admin/bookings`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">Clear</Link>
        )}
      </form>

      {/* Table with bulk actions */}
      <BookingsTableClient bookings={serialized as any} locale={locale} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <span>{totalCount} total bookings</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/${locale}/admin/bookings?page=${page - 1}&search=${search}&status=${statusFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}`} className="px-4 py-2 bg-white border border-[#D9B574]/40 rounded-lg hover:bg-[#D9B574]/10 transition-colors">← Previous</Link>
            )}
            <span className="px-4 py-2 font-medium">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={`/${locale}/admin/bookings?page=${page + 1}&search=${search}&status=${statusFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}`} className="px-4 py-2 bg-white border border-[#D9B574]/40 rounded-lg hover:bg-[#D9B574]/10 transition-colors">Next →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
