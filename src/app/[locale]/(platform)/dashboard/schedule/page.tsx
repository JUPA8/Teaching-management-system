import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ScheduleBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { name: true; type: true } };
    teacher: { include: { user: { select: { name: true } } } };
    attendance: { select: { status: true } };
    grades: { select: { score: true; maxScore: true } };
  };
}>;

export default async function StudentSchedulePage() {
  const user = await requireAuth().catch(() => null);
  if (!user) return null;

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Student profile not found.</p>
      </div>
    );
  }

  const allBookings = await prisma.booking.findMany({
    where: { studentId: student.id },
    include: {
      course: { select: { name: true, type: true } },
      teacher: { include: { user: { select: { name: true } } } },
      attendance: { select: { status: true } },
      grades: { select: { score: true, maxScore: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  const now = new Date();
  const upcoming = allBookings.filter(
    (b: ScheduleBooking) =>
      new Date(b.scheduledAt) >= now &&
      b.status !== 'CANCELLED' &&
      b.status !== 'COMPLETED'
  );
  const past = allBookings.filter(
    (b: ScheduleBooking) => new Date(b.scheduledAt) < now || b.status === 'CANCELLED' || b.status === 'COMPLETED'
  );

  const statusConfig: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    CONFIRMED: {
      label: 'Confirmed',
      icon: <CheckCircle className="w-4 h-4" />,
      cls: 'bg-green-50 text-green-700 border-green-200',
    },
    PENDING: {
      label: 'Pending',
      icon: <AlertCircle className="w-4 h-4" />,
      cls: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    COMPLETED: {
      label: 'Completed',
      icon: <CheckCircle className="w-4 h-4" />,
      cls: 'bg-gray-50 text-gray-600 border-gray-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      icon: <XCircle className="w-4 h-4" />,
      cls: 'bg-red-50 text-red-600 border-red-200',
    },
    NO_SHOW: {
      label: 'No Show',
      icon: <XCircle className="w-4 h-4" />,
      cls: 'bg-orange-50 text-orange-600 border-orange-200',
    },
  };

  const attendanceConfig: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    EXCUSED: 'bg-blue-100 text-blue-700',
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isToday = d.toDateString() === today.toDateString();
    const isTomorrow = d.toDateString() === tomorrow.toDateString();
    const dayStr = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { dayStr, timeStr };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#2B7A78]" />
          My Schedule
        </h1>
        <p className="text-gray-500 mt-1">
          {upcoming.length} upcoming session{upcoming.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming sessions scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking: ScheduleBooking) => {
              const { dayStr, timeStr } = formatDateTime(booking.scheduledAt);
              const endTime = new Date(booking.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const sc = statusConfig[booking.status] ?? statusConfig.PENDING;
              const isToday = new Date(booking.scheduledAt).toDateString() === new Date().toDateString();

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl shadow-sm border ${
                    isToday ? 'border-[#2B7A78]/30 ring-1 ring-[#2B7A78]/20' : 'border-gray-100'
                  } p-5`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isToday && (
                          <span className="text-xs font-bold text-[#2B7A78] bg-[#2B7A78]/10 px-2 py-0.5 rounded-full">
                            TODAY
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900">{booking.course.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        with {booking.teacher.user.name ?? 'Your Teacher'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {dayStr}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {timeStr} – {endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.cls}`}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                      {booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Sessions</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Course
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Teacher
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Attendance
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {past.slice(0, 20).map((booking: ScheduleBooking) => {
                  const sc    = statusConfig[booking.status] ?? statusConfig.COMPLETED;
                  const grade = booking.grades[0] ?? null;
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {booking.course.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {booking.teacher.user.name ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(booking.scheduledAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border w-fit ${sc.cls}`}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.attendance ? (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              attendanceConfig[booking.attendance.status] ??
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {booking.attendance.status}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {grade ? (
                          <span className="text-sm font-semibold text-gray-800">
                            {grade.score}/{grade.maxScore}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
