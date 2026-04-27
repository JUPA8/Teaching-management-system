export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteBookingButton from './DeleteBookingButton';
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

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#D9B574] to-[#C4A565] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D9B574] to-[#C4A565] bg-clip-text text-transparent">
            Bookings Management
          </h1>
        </div>
        <Link href={`/${locale}/admin/bookings/create`} className="relative group overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] transform group-hover:scale-105 transition-transform"></div>
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Create Booking</span>
          </div>
        </Link>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Search</label>
          <input
            name="search"
            defaultValue={search}
            placeholder="Student, teacher, or course…"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9B574]/30"
          />
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

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        <div className="h-2 bg-gradient-to-r from-[#D9B574] via-[#C4A565] to-[#D9B574]"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#D9B574]/10 to-[#C4A565]/10">
              <tr>
                {['Date & Time', 'Course', 'Student', 'Teacher', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {bookings.map((booking, index) => (
                <tr key={booking.id} className={`hover:bg-gradient-to-r hover:from-[#D9B574]/5 hover:to-[#C4A565]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{new Date(booking.scheduledAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-600">{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.course.name}</div>
                    <div className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-1">{booking.course.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.student.user.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.student.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.teacher.user.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.teacher.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                      booking.status === 'CONFIRMED' ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' :
                      booking.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white' :
                      booking.status === 'COMPLETED' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' :
                      booking.status === 'CANCELLED' ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' :
                      'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                    }`}>{booking.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/${locale}/admin/bookings/${booking.id}`} className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">View</Link>
                      <Link href={`/${locale}/admin/bookings/${booking.id}/edit`} className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">Edit</Link>
                      <DeleteBookingButton bookingId={booking.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20 mt-4">
          <p className="text-gray-600 text-lg mb-6">No bookings found</p>
          <Link href={`/${locale}/admin/bookings/create`} className="inline-block px-8 py-4 bg-gradient-to-br from-[#D9B574] to-[#C4A565] text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg">
            Create Your First Booking
          </Link>
        </div>
      )}

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
