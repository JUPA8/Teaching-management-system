import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Calendar } from 'lucide-react';

type ScheduleBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { name: true } };
    student: { include: { user: { select: { name: true } } } };
  };
}>;

export default async function TeacherSchedulePage() {
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        where: {
          scheduledAt: { gte: new Date() },
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          course: { select: { name: true } },
          student: { include: { user: { select: { name: true } } } },
        },
      },
    },
  });

  if (!teacher) return null;

  const bookings = teacher.bookings;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Schedule
        </h1>
        <p className="text-gray-500 mt-1">{bookings.length} upcoming session{bookings.length !== 1 ? 's' : ''}.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No upcoming sessions scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(bookings as ScheduleBooking[]).map((booking: ScheduleBooking) => {
            const date = new Date(booking.scheduledAt);
            const endDate = new Date(booking.endTime);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white text-center ${isToday ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    <span className="text-xs font-medium">{date.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{booking.course.name}</p>
                    <p className="text-sm text-gray-500">{booking.student.user.name ?? 'Student'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
