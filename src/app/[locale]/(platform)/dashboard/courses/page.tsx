import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BookOpen, Award, TrendingUp, CheckCircle, XCircle, Clock, MinusCircle } from 'lucide-react';

type CompletedBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { id: true; name: true; type: true; totalSessions: true; level: true } };
    teacher: { include: { user: { select: { name: true } } } };
    attendance: { select: { status: true } };
    grades: { select: { score: true; maxScore: true } };
  };
}>;

type EnrollmentItem = Prisma.CourseEnrollmentGetPayload<{
  include: { course: { select: { id: true; name: true; type: true; totalSessions: true; level: true } } };
}>;

const courseTypeLabel: Record<string, string> = {
  QURAN_KIDS:      'Quran (Kids)',
  QURAN_ADULTS:    'Quran (Adults)',
  ARABIC_LANGUAGE: 'Arabic Language',
  ISLAMIC_STUDIES: 'Islamic Studies',
};

const attIcon: Record<string, React.ReactNode> = {
  PRESENT: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  ABSENT:  <XCircle     className="w-3.5 h-3.5 text-red-400" />,
  LATE:    <Clock       className="w-3.5 h-3.5 text-yellow-500" />,
  EXCUSED: <MinusCircle className="w-3.5 h-3.5 text-gray-400" />,
};
const attLabel: Record<string, string> = {
  PRESENT: 'Attended',
  ABSENT:  'Absent',
  LATE:    'Late',
  EXCUSED: 'Excused',
};
const attBadge: Record<string, string> = {
  PRESENT: 'bg-green-50 text-green-700',
  ABSENT:  'bg-red-50 text-red-600',
  LATE:    'bg-yellow-50 text-yellow-700',
  EXCUSED: 'bg-gray-100 text-gray-500',
};

export default async function StudentCoursesPage() {
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

  // Fetch enrollments for progress tracking (separate concern)
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { studentId: student.id, isActive: true },
    include: { course: { select: { id: true, name: true, type: true, totalSessions: true, level: true } } },
    orderBy: { enrolledAt: 'desc' },
  });

  // Fetch ALL completed bookings — the source of truth for session history
  const completedBookings = await prisma.booking.findMany({
    where: { studentId: student.id, status: 'COMPLETED' },
    include: {
      course: { select: { id: true, name: true, type: true, totalSessions: true, level: true } },
      teacher: { include: { user: { select: { name: true } } } },
      attendance: { select: { status: true } },
      grades: { select: { score: true, maxScore: true } },
    },
    orderBy: { scheduledAt: 'desc' },
  }) as CompletedBooking[];

  // Group completed sessions by courseId for stats
  type CourseStats = {
    name: string;
    type: string;
    sessionsTotal: number;
    sessionsPresent: number;
    totalScore: number;
    gradedSessions: number;
  };
  const statsMap = new Map<string, CourseStats>();

  for (const booking of completedBookings) {
    const cid = booking.course.id;
    if (!statsMap.has(cid)) {
      statsMap.set(cid, {
        name: booking.course.name,
        type: booking.course.type,
        sessionsTotal: 0,
        sessionsPresent: 0,
        totalScore: 0,
        gradedSessions: 0,
      });
    }
    const entry = statsMap.get(cid)!;
    entry.sessionsTotal += 1;
    if (booking.attendance?.status === 'PRESENT' || booking.attendance?.status === 'LATE') {
      entry.sessionsPresent += 1;
    }
    if (booking.grades[0]) {
      const g = booking.grades[0];
      entry.totalScore += (g.score / g.maxScore) * 100;
      entry.gradedSessions += 1;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#2B7A78]" />
          My Courses &amp; Session History
        </h1>
        <p className="text-gray-500 mt-1">
          {completedBookings.length} completed session{completedBookings.length !== 1 ? 's' : ''}
          {enrollments.length > 0 ? ` · ${enrollments.length} active enrollment${enrollments.length !== 1 ? 's' : ''}` : ''}
        </p>
      </div>

      {/* ── Enrollment Progress Cards (if any) ── */}
      {enrollments.length > 0 && (
        <div className="grid gap-6">
          {(enrollments as EnrollmentItem[]).map((enrollment: EnrollmentItem) => {
            const { course, progress } = enrollment;
            const stats = statsMap.get(course.id);
            const attendancePct =
              stats && stats.sessionsTotal > 0
                ? Math.round((stats.sessionsPresent / stats.sessionsTotal) * 100)
                : null;
            const avgGrade =
              stats && stats.gradedSessions > 0
                ? Math.round((stats.totalScore / stats.gradedSessions) * 10) / 10
                : null;

            return (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{course.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-[#2B7A78]/10 text-[#2B7A78] px-2 py-0.5 rounded-full font-medium">
                        {courseTypeLabel[course.type] ?? course.type}
                      </span>
                      {course.level && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2B7A78]">{progress}%</p>
                    <p className="text-xs text-gray-400">Progress</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#2B7A78] to-[#3a9e9b] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-lg font-bold text-gray-900">{stats?.sessionsTotal ?? 0}</p>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {attendancePct !== null ? `${attendancePct}%` : '—'}
                    </p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                      <Award className="w-4 h-4 text-purple-500" />
                      {avgGrade !== null ? `${avgGrade}%` : '—'}
                    </p>
                    <p className="text-xs text-gray-500">Avg Grade</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Session History (all completed sessions) ── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Session History
        </h2>

        {completedBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No completed sessions yet.</p>
            <p className="text-gray-400 text-sm mt-1">Sessions will appear here after the teacher marks attendance.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Teacher</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completedBookings.map((booking: CompletedBooking) => {
                  const date  = new Date(booking.scheduledAt);
                  const att   = booking.attendance?.status ?? null;
                  const grade = booking.grades[0] ?? null;
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                        {date.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                        <br />
                        <span className="text-xs text-gray-400">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">{booking.course.name}</td>
                      <td className="px-5 py-3 text-gray-600">{booking.teacher.user.name ?? '—'}</td>
                      <td className="px-5 py-3">
                        {att ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${attBadge[att]}`}>
                            {attIcon[att]}
                            {attLabel[att]}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
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
      </div>
    </div>
  );
}
