import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CoursesTableClient from './CoursesTableClient';

export default async function AdminCoursesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      price: true,
      duration: true,
      totalSessions: true,
      isActive: true,
      _count: { select: { enrollments: true, bookings: true } },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-[#D9B574] rounded-full" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-[#D9B574] bg-clip-text text-transparent">
            Courses Management
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/courses/create`}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 transform group-hover:scale-105 transition-transform" />
          <div className="relative px-6 py-3">
            <span className="text-white font-bold">+ Create Course</span>
          </div>
        </Link>
      </div>

      <CoursesTableClient courses={courses} locale={locale} />
    </div>
  );
}
