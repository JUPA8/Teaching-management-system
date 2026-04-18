import { prisma } from '@/lib/prisma';

export default async function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  // Fetch statistics
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalCourses,
    activeCourses,
    totalBookings,
    pendingBookings,
    totalPayments,
    completedPayments,
    pendingTrialRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.course.count(),
    prisma.course.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: 'COMPLETED' } }),
    prisma.probestundeRequest.count({ where: { isContacted: false } }),
  ]);

  // Calculate total revenue
  const paymentsSum = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  const totalRevenue = paymentsSum._sum.amount || 0;

  return (
    <div>
      {/* Header with Islamic styling */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <div className="h-1 flex-1 bg-gradient-to-r from-[#D9B574] to-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600 ml-20">Welcome back, manage your institute</p>
      </div>

      {/* Statistics Grid with Islamic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] rounded-2xl transform group-hover:scale-105 transition-transform"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 m-0.5 border-2 border-[#D9B574]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-semibold">Total Users</p>
                <p className="text-4xl font-bold text-[#2B7A78] mt-2">{totalUsers}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-[#D9B574]/20">
              <span className="text-sm text-gray-600">
                <span className="text-green-600 font-bold">{totalStudents}</span> Students
              </span>
              <span className="text-sm text-gray-600">
                <span className="text-purple-600 font-bold">{totalTeachers}</span> Teachers
              </span>
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 m-0.5 border-2 border-[#D9B574]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-semibold">Total Courses</p>
                <p className="text-4xl font-bold text-green-700 mt-2">{totalCourses}</p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D9B574]/20">
              <span className="text-sm text-gray-600">
                <span className="text-green-600 font-bold">{activeCourses}</span> Active courses
              </span>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] rounded-2xl transform group-hover:scale-105 transition-transform"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 m-0.5 border-2 border-[#D9B574]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-semibold">Bookings</p>
                <p className="text-4xl font-bold text-[#C4A565] mt-2">{totalBookings}</p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D9B574]/20">
              <span className="text-sm text-gray-600">
                <span className="text-yellow-600 font-bold">{pendingBookings}</span> Pending
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 m-0.5 border-2 border-[#D9B574]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-semibold">Revenue</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">€{totalRevenue.toFixed(0)}</p>
              </div>
            </div>
            <div className="pt-4 border-t-2 border-[#D9B574]/20">
              <span className="text-sm text-gray-600">
                <span className="text-green-600 font-bold">{completedPayments}</span> Payments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for pending trial requests with Islamic styling */}
      {pendingTrialRequests > 0 && (
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur-sm opacity-50"></div>
          <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-orange-900 font-bold text-lg">
                  You have <span className="text-orange-600">{pendingTrialRequests}</span> pending trial class requests
                </p>
                <a href={`/${locale}/admin/probestunde`} className="text-orange-700 hover:text-orange-900 font-semibold text-sm underline">
                  View requests →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions with Islamic Cards */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-[#D9B574]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-[#D9B574] to-transparent rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href={`/${locale}/admin/users/create`}
            className="relative group overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] transform group-hover:scale-105 transition-transform"></div>
            <div className="relative p-6 text-center">
              <span className="text-white font-bold text-lg block mb-2">+ Create User</span>
              <span className="text-[#D9B574] text-sm">Add new student or teacher</span>
            </div>
          </a>
          
          <a
            href={`/${locale}/admin/courses/create`}
            className="relative group overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 transform group-hover:scale-105 transition-transform"></div>
            <div className="relative p-6 text-center">
              <span className="text-white font-bold text-lg block mb-2">+ Create Course</span>
              <span className="text-green-200 text-sm">Add new course offering</span>
            </div>
          </a>
          
          <a
            href={`/${locale}/admin/bookings/create`}
            className="relative group overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] transform group-hover:scale-105 transition-transform"></div>
            <div className="relative p-6 text-center">
              <span className="text-white font-bold text-lg block mb-2">+ Create Booking</span>
              <span className="text-yellow-100 text-sm">Schedule a new class</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
