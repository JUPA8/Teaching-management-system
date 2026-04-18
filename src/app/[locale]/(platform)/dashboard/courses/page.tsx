import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

type StudentWithData = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      where: { isActive: true };
      include: { course: { select: { id: true; name: true; type: true; totalSessions: true; level: true } } };
    };
    grades: { include: { course: { select: { id: true; name: true } } } };
    attendance: { include: { booking: { include: { course: { select: { id: true; name: true } } } } } };
  };
}>;
type EnrollmentItem = StudentWithData['enrollments'][number];
type GradeItem = StudentWithData['grades'][number];

export default async function StudentCoursesPage() {
  const user = await requireAuth().catch(() => null);
  if (!user) return null;

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      enrollments: {
        where: { isActive: true },
        include: { course: { select: { id: true, name: true, type: true, totalSessions: true, level: true } } },
        orderBy: { enrolledAt: 'desc' },
      },
      grades: {
        include: { course: { select: { id: true, name: true } } },
        orderBy: { gradedAt: 'desc' },
      },
      attendance: {
        include: { booking: { include: { course: { select: { id: true, name: true } } } } },
        orderBy: { markedAt: 'desc' },
      },
    },
  });

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Student profile not found.</p>
      </div>
    );
  }

  // Group attendance and grades by course
  const courseStats = new Map<
    string,
    { name: string; sessionsTotal: number; sessionsPresent: number; grades: typeof student.grades }
  >();

  for (const att of student.attendance) {
    const cid = att.booking.course.id;
    const cname = att.booking.course.name;
    if (!courseStats.has(cid)) {
      courseStats.set(cid, { name: cname, sessionsTotal: 0, sessionsPresent: 0, grades: [] });
    }
    const entry = courseStats.get(cid)!;
    entry.sessionsTotal += 1;
    if (att.status === 'PRESENT' || att.status === 'LATE') {
      entry.sessionsPresent += 1;
    }
  }

  for (const grade of student.grades) {
    const cid = grade.course.id;
    if (!courseStats.has(cid)) {
      courseStats.set(cid, { name: grade.course.name, sessionsTotal: 0, sessionsPresent: 0, grades: [] });
    }
    courseStats.get(cid)!.grades.push(grade);
  }

  const courseTypeLabel: Record<string, string> = {
    QURAN_KIDS: 'Quran (Kids)',
    QURAN_ADULTS: 'Quran (Adults)',
    ARABIC_LANGUAGE: 'Arabic Language',
    ISLAMIC_STUDIES: 'Islamic Studies',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#2B7A78]" />
          My Courses
        </h1>
        <p className="text-gray-500 mt-1">
          {student.enrollments.length} active enrollment{student.enrollments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {student.enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No courses enrolled yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Contact your administrator to get enrolled in a course.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {student.enrollments.map((enrollment: EnrollmentItem) => {
            const { course, progress } = enrollment;
            const stats = courseStats.get(course.id);
            const attendancePct =
              stats && stats.sessionsTotal > 0
                ? Math.round((stats.sessionsPresent / stats.sessionsTotal) * 100)
                : null;
            const gradeList: GradeItem[] = stats?.grades ?? [];
            const avgGrade =
              gradeList.length > 0
                ? Math.round(
                    (gradeList.reduce((s: number, g: GradeItem) => s + (g.score / g.maxScore) * 100, 0) /
                      gradeList.length) *
                      10
                  ) / 10
                : null;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
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

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-lg font-bold text-gray-900">
                        {stats?.sessionsTotal ?? 0}
                      </p>
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

                  {/* Recent grades */}
                  {gradeList.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Recent Grades
                      </p>
                      <div className="space-y-2">
                        {gradeList.slice(0, 3).map((grade: GradeItem) => {
                          const pct = Math.round((grade.score / grade.maxScore) * 100);
                          return (
                            <div
                              key={grade.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-700">
                                {grade.label ?? 'Assessment'}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      pct >= 80
                                        ? 'bg-green-500'
                                        : pct >= 60
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span
                                  className={`font-semibold text-xs ${
                                    pct >= 80
                                      ? 'text-green-600'
                                      : pct >= 60
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
