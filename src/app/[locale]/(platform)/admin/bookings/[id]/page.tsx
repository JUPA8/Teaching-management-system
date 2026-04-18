import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, BookOpen, Video, FileText, AlertCircle } from 'lucide-react';

const statusStyles: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  NO_SHOW: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default async function BookingViewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await requireAdmin();
  const { locale, id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      course: true,
      student: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
      teacher: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
      attendance: true,
    },
  });

  if (!booking) notFound();

  const scheduledAt = new Date(booking.scheduledAt);
  const endTime = new Date(booking.endTime);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/bookings`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </Link>
        </div>
        <Link
          href={`/${locale}/admin/bookings/${id}/edit`}
          className="px-5 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          Edit Booking
        </Link>
      </div>

      {/* Title + status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{booking.course.name}</h1>
          <span
            className={`px-3 py-1.5 text-sm font-bold rounded-lg border ${
              statusStyles[booking.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {booking.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm">Booking ID: {booking.id}</p>

        {/* Date / time */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-[#2B7A78]" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-semibold text-gray-900">
                {scheduledAt.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Clock className="w-5 h-5 text-[#2B7A78]" />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="font-semibold text-gray-900">
                {scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* People */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Student */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-gray-900">Student</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {booking.student.user.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{booking.student.user.name ?? 'Unknown'}</p>
              <p className="text-sm text-gray-500">{booking.student.user.email}</p>
              {booking.student.user.phone && (
                <p className="text-sm text-gray-500">{booking.student.user.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Teacher */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#2B7A78]" />
            <h2 className="font-semibold text-gray-900">Teacher</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {booking.teacher.user.name?.[0]?.toUpperCase() ?? 'T'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{booking.teacher.user.name ?? 'Unknown'}</p>
              <p className="text-sm text-gray-500">{booking.teacher.user.email}</p>
              {booking.teacher.user.phone && (
                <p className="text-sm text-gray-500">{booking.teacher.user.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">Course Details</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-lg font-bold text-gray-900">€{booking.course.price}</p>
            <p className="text-xs text-gray-500">Price</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-lg font-bold text-gray-900">{booking.course.duration} min</p>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-lg font-bold text-gray-900">{booking.course.totalSessions}</p>
            <p className="text-xs text-gray-500">Total Sessions</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-bold text-gray-900">{booking.course.type.replace(/_/g, ' ')}</p>
            <p className="text-xs text-gray-500">Type</p>
          </div>
        </div>
      </div>

      {/* Meeting link, notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {booking.meetingLink && (
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Meeting Link</p>
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm break-all hover:text-blue-800"
              >
                {booking.meetingLink}
              </a>
            </div>
          </div>
        )}

        {booking.notes && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700">{booking.notes}</p>
            </div>
          </div>
        )}

        {booking.adminNotes && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#D9B574] mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
              <p className="text-sm text-gray-700">{booking.adminNotes}</p>
            </div>
          </div>
        )}

        {booking.status === 'CANCELLED' && booking.cancelReason && (
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-xs text-red-500 mb-1">Cancellation Reason</p>
              <p className="text-sm text-red-700">{booking.cancelReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance */}
      {booking.attendance && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Attendance</h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 text-sm font-bold rounded-lg border ${
                booking.attendance.status === 'PRESENT'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : booking.attendance.status === 'LATE'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : booking.attendance.status === 'EXCUSED'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              {booking.attendance.status}
            </span>
            {booking.attendance.notes && (
              <p className="text-sm text-gray-500">{booking.attendance.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
