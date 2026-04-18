import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, BookOpen, Calendar, Award } from 'lucide-react';
import AttendanceForm from './AttendanceForm';
import GradeForm from './GradeForm';

type DetailBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { id: true; name: true } };
    attendance: true;
  };
}>;

type DetailGrade = Prisma.GradeGetPayload<{
  include: { course: { select: { name: true } } };
}>;

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: studentId } = await params;
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!teacher) return null;

  // Verify teacher has a relationship with this student
  const hasRelationship = await prisma.booking.findFirst({
    where: { teacherId: teacher.id, studentId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
  });
  if (!hasRelationship) notFound();

  // Fetch student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!student) notFound();

  // Fetch bookings for this teacher+student
  const bookings = await prisma.booking.findMany({
    where: { teacherId: teacher.id, studentId },
    include: {
      course: { select: { id: true, name: true } },
      attendance: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  // Fetch grades
  const grades = await prisma.grade.findMany({
    where: { teacherId: teacher.id, studentId },
    include: { course: { select: { name: true } } },
    orderBy: { gradedAt: 'desc' },
  });

  // Unique courses this teacher teaches this student
  const courseSet = new Map<string, string>();
  for (const b of bookings) {
    courseSet.set(b.course.id, b.course.name);
  }
  const courses = Array.from(courseSet.entries()).map(([id, name]) => ({ id, name }));

  // Attendance stats
  const markedBookings = (bookings as DetailBooking[]).filter((b: DetailBooking) => b.attendance);
  const presentCount = markedBookings.filter(
    (b: DetailBooking) => b.attendance?.status === 'PRESENT' || b.attendance?.status === 'LATE'
  ).length;
  const attendancePct =
    markedBookings.length > 0 ? Math.round((presentCount / markedBookings.length) * 100) : null;

  // Average grade
  const avgGrade =
    grades.length > 0
      ? Math.round(((grades as DetailGrade[]).reduce((sum: number, g: DetailGrade) => sum + (g.score / g.maxScore) * 100, 0) / grades.length) * 10) / 10
      : null;

  const statusColor: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    EXCUSED: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <a
          href={`/${locale}/teacher/students`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </a>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {student.user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {student.user.name ?? 'Unknown Student'}
            </h1>
            <p className="text-gray-500">{student.user.email}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Sessions</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {attendancePct !== null ? `${attendancePct}%` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {avgGrade !== null ? `${avgGrade}%` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Grade</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sessions & Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Sessions & Attendance</h2>
          </div>

          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {bookings.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-500 text-sm">No sessions found.</p>
            ) : (
              (bookings as DetailBooking[]).map((booking: DetailBooking) => (
                <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.course.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(booking.scheduledAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.attendance ? (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          statusColor[booking.attendance.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.attendance.status}
                      </span>
                    ) : (
                      <AttendanceForm bookingId={booking.id} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Grades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-gray-900">Grades</h2>
            </div>
            <GradeForm studentId={studentId} courses={courses} />
          </div>

          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {grades.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-500 text-sm">No grades recorded yet.</p>
            ) : (
              (grades as DetailGrade[]).map((grade: DetailGrade) => {
                const pct = Math.round((grade.score / grade.maxScore) * 100);
                return (
                  <div key={grade.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {grade.label ?? 'Assessment'}
                        </p>
                        <p className="text-xs text-gray-500">{grade.course.name}</p>
                        {grade.notes && (
                          <p className="text-xs text-gray-400 mt-0.5 italic">{grade.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {grade.score}/{grade.maxScore}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            pct >= 80
                              ? 'text-green-600'
                              : pct >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {pct}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(grade.gradedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-900">Enrolled Courses</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <span key={c.id} className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
