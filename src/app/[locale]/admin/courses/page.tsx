import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminCoursesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          enrollments: true,
          bookings: true,
        },
      },
    },
  });

  return (
    <div>
      {/* Islamic Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-[#D9B574] bg-clip-text text-transparent">
            Courses Management
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/courses/create`}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 transform group-hover:scale-105 transition-transform"></div>
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Create Course</span>
          </div>
        </Link>
      </div>

      {/* Islamic styled cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="relative group">
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity ${
              course.isActive ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}></div>
            
            {/* Card content */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-[#D9B574]/20 hover:shadow-2xl transition-all">
              {/* Islamic pattern header */}
              <div className={`h-3 bg-gradient-to-r ${
                course.isActive 
                  ? 'from-green-500 via-[#D9B574] to-green-500' 
                  : 'from-gray-400 via-gray-500 to-gray-400'
              }`}></div>
              
              <div className="p-6">
                {/* Course title and status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                    course.isActive 
                      ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                  }`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                
                {/* Islamic divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#D9B574] to-transparent mb-4"></div>
                
                {/* Course details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className="font-bold text-[#2B7A78]">{course.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Price:</span>
                    <span className="font-bold text-green-600">€{course.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="font-bold text-purple-600">{course.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Sessions:</span>
                    <span className="font-bold text-blue-600">{course.totalSessions}</span>
                  </div>
                </div>

                {/* Islamic divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#D9B574] to-transparent mb-4"></div>

                {/* Footer with actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2B7A78] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{course._count.enrollments}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">students</span>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/${locale}/admin/courses/${course.id}`} 
                      className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/${locale}/admin/courses/${course.id}/edit`} 
                      className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg mb-6">No courses found</p>
          <Link
            href={`/${locale}/admin/courses/create`}
            className="inline-block px-8 py-4 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
          >
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
}
