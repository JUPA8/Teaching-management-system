import { requireTeacher } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';

export default async function TeacherStudentsPage() {
  const user = await requireTeacher().catch(() => null);
  if (!user) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        include: {
          student: { include: { user: { select: { name: true, email: true } } } },
          course: { select: { name: true } },
        },
        orderBy: { scheduledAt: 'desc' },
      },
    },
  });

  if (!teacher) return null;

  // Deduplicate students
  const studentMap = new Map<string, { name: string; email: string; courses: Set<string> }>();
  for (const booking of teacher.bookings) {
    const id = booking.student.id;
    if (!studentMap.has(id)) {
      studentMap.set(id, {
        name: booking.student.user.name ?? 'Unknown',
        email: booking.student.user.email ?? '',
        courses: new Set(),
      });
    }
    studentMap.get(id)!.courses.add(booking.course.name);
  }
  const students = Array.from(studentMap.values());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          My Students
        </h1>
        <p className="text-gray-500 mt-1">{students.length} student{students.length !== 1 ? 's' : ''} enrolled in your courses.</p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No students enrolled yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {student.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(student.courses).map((course) => (
                        <span key={course} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
