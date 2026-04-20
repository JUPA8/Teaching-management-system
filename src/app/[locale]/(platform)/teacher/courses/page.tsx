import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BookOpen, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

type CourseAssignment = Prisma.CourseTeacherGetPayload<{
  include: {
    course: {
      include: { _count: { select: { bookings: true } } };
    };
  };
}>;

type CompletedBooking = Prisma.BookingGetPayload<{
  include: {
    course: { select: { id: true; name: true } };
    student: { include: { user: { select: { name: true } } } };
    attendance: { select: { status: true } };
    grades: { select: { score: true; maxScore: true } };
  };
}>;

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

export default async function TeacherCoursesPage() {
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      courses: {
        include: {
          course: {
            include: {
              _count: { select: { bookings: true } },
            },
          },
        },
        orderBy: { assignedAt: 'desc' },
      },
    },
  });

  if (!teacher) return null;

  // Fetch all completed sessions for this teacher
  const completedBookings = await prisma.booking.findMany({
    where: { teacherId: teacher.id, status: 'COMPLETED' },
    include: {
      course: { select: { id: true, name: true } },
      student: { include: { user: { select: { name: true } } } },
      attendance: { select: { status: true } },
      grades: { select: { score: true, maxScore: true } },
    },
    orderBy: { scheduledAt: 'desc' },
  }) as CompletedBooking[];

  const courseAssignments = teacher.courses;

  return (
    <div className="space-y-10">
      {/* ── Assigned Courses ── */}
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            My Courses
          </h1>
          <p className="text-gray-500 mt-1">
            {courseAssignments.length} course{courseAssignments.length !== 1 ? 's' : ''} assigned to you.
          </p>
        </div>

        {courseAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses assigned yet. Contact your administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courseAssignments as CourseAssignment[]).map((assignment: CourseAssignment) => {
              const { course } = assignment;
              return (
                <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{course.name}</h3>
                  {course.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {course._count.bookings} booking{course._count.bookings !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">€{course.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Session History ── */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Session History
          </h2>
          <p className="text-gray-500 mt-1">
            {completedBookings.length} completed session{completedBookings.length !== 1 ? 's' : ''} across all courses.
          </p>
        </div>

        {completedBookings.length === 0 ? (
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
                {completedBookings.map((booking: CompletedBooking) => {
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
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${attBadge[att]}`}>
                            {attIcon[att]}
                            {attLabel[att]}
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
      </div>
    </div>
  );
}
