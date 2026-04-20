import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Calendar, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import MarkAttendanceButton from './MarkAttendanceButton';

type ScheduleBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { id: true; name: true } };
    student: { include: { user: { select: { name: true } } } };
    attendance: { select: { status: true } };
    grades: { select: { score: true; maxScore: true } };
  };
}>;

const statusIcon = {
  PRESENT: <CheckCircle className="w-4 h-4 text-green-500" />,
  ABSENT:  <XCircle    className="w-4 h-4 text-red-400" />,
  LATE:    <Clock      className="w-4 h-4 text-yellow-500" />,
  EXCUSED: <MinusCircle className="w-4 h-4 text-gray-400" />,
};

const statusLabel: Record<string, string> = {
  PRESENT: 'Attended',
  ABSENT:  'Absent',
  LATE:    'Late',
  EXCUSED: 'Excused',
};

const statusBadge: Record<string, string> = {
  PRESENT: 'bg-green-50 text-green-700',
  ABSENT:  'bg-red-50 text-red-600',
  LATE:    'bg-yellow-50 text-yellow-700',
  EXCUSED: 'bg-gray-100 text-gray-600',
};

export default async function TeacherSchedulePage() {
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        orderBy: { scheduledAt: 'asc' },
        include: {
          course: { select: { id: true, name: true } },
          student: { include: { user: { select: { name: true } } } },
          attendance: { select: { status: true } },
          grades: { select: { score: true, maxScore: true } },
        },
      },
    },
  });

  if (!teacher) return null;

  const now = new Date();

  // Upcoming: confirmed/pending, scheduled in the future
  const upcoming = (teacher.bookings as ScheduleBooking[]).filter(
    (b: ScheduleBooking) =>
      (b.status === 'CONFIRMED' || b.status === 'PENDING') &&
      new Date(b.scheduledAt) >= now
  );

  // Completed sessions (most recent first)
  const completed = (teacher.bookings as ScheduleBooking[])
    .filter((b: ScheduleBooking) => b.status === 'COMPLETED')
    .sort((a: ScheduleBooking, b: ScheduleBooking) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  return (
    <div className="space-y-10">
      {/* ── Upcoming Schedule ── */}
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Upcoming Schedule
          </h1>
          <p className="text-gray-500 mt-1">
            {upcoming.length} upcoming session{upcoming.length !== 1 ? 's' : ''}.
            Mark attendance when the session is complete.
          </p>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No upcoming sessions.</p>
            <p className="text-gray-400 text-sm mt-1">New bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking: ScheduleBooking) => {
              const date   = new Date(booking.scheduledAt);
              const end    = new Date(booking.endTime);
              const isToday = date.toDateString() === now.toDateString();
              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between gap-4 flex-wrap ${
                    isToday ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white text-center shrink-0 ${
                      isToday ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      <span className="text-[10px] font-medium leading-none">
                        {date.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-tight">{date.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.course.name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.student.user.name ?? 'Student'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' – '}
                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isToday && (
                          <span className="ml-2 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                            Today
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Attendance + grade action */}
                  <MarkAttendanceButton
                    bookingId={booking.id}
                    studentId={booking.student.id}
                    courseId={booking.course.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Session History ── */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Session History
          </h2>
          <p className="text-gray-500 mt-1">
            {completed.length} completed session{completed.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {completed.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No completed sessions yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completed.map((booking: ScheduleBooking) => {
                  const date  = new Date(booking.scheduledAt);
                  const att   = booking.attendance?.status ?? null;
                  const grade = booking.grades[0] ?? null;
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                        {date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                        <br />
                        <span className="text-xs text-gray-400">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">{booking.course.name}</td>
                      <td className="px-5 py-3 text-gray-600">{booking.student.user.name ?? '—'}</td>
                      <td className="px-5 py-3">
                        {att ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[att]}`}>
                            {statusIcon[att as keyof typeof statusIcon]}
                            {statusLabel[att]}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Not recorded</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {grade ? (
                          <span className="text-sm font-semibold text-gray-800">
                            {grade.score}/{grade.maxScore}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
