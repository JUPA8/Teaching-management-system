import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BookOpen, Calendar, TrendingUp } from 'lucide-react';

type TeacherBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { name: true } };
    student: { include: { user: { select: { name: true } } } };
  };
}>;

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          courses: true,
          bookings: true,
        },
      },
      bookings: {
        where: {
          status: 'CONFIRMED',
          scheduledAt: { gte: new Date() },
        },
        take: 5,
        orderBy: { scheduledAt: 'asc' },
        include: {
          course: { select: { name: true } },
          student: { include: { user: { select: { name: true } } } },
        },
      },
    },
  });

  const stats = [
    { label: 'Assigned Courses', value: teacher?._count.courses ?? 0, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Bookings', value: teacher?._count.bookings ?? 0, icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Upcoming Sessions', value: teacher?.bookings.length ?? 0, icon: TrendingUp, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your teaching activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Sessions
          </h2>
          <a href={`/${locale}/teacher/schedule`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </a>
        </div>

        {teacher?.bookings.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No upcoming sessions scheduled.</p>
        ) : (
          <div className="space-y-3">
            {(teacher?.bookings ?? [] as TeacherBooking[]).map((booking: TeacherBooking) => {
              const date = new Date(booking.scheduledAt);
              return (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{booking.course.name}</p>
                    <p className="text-sm text-gray-500">{booking.student.user.name ?? 'Student'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{date.toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
