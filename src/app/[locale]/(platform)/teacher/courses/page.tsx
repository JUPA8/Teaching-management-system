import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BookOpen } from 'lucide-react';

type CourseAssignment = Prisma.CourseTeacherGetPayload<{
  include: {
    course: {
      include: { _count: { select: { bookings: true } } };
    };
  };
}>;

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

  const courseAssignments = teacher.courses;

  return (
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
  );
}
