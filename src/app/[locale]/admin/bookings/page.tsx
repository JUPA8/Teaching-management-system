import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminBookingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const bookings = await prisma.booking.findMany({
    orderBy: { scheduledAt: 'desc' },
    take: 50,
    include: {
      course: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      teacher: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      {/* Islamic Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#D9B574] to-[#C4A565] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D9B574] to-[#C4A565] bg-clip-text text-transparent">
            Bookings Management
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/bookings/create`}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] transform group-hover:scale-105 transition-transform"></div>
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Create Booking</span>
          </div>
        </Link>
      </div>

      {/* Islamic styled table container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        {/* Decorative header */}
        <div className="h-2 bg-gradient-to-r from-[#D9B574] via-[#C4A565] to-[#D9B574]"></div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#D9B574]/10 to-[#C4A565]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {bookings.map((booking, index) => (
                <tr 
                  key={booking.id}
                  className={`hover:bg-gradient-to-r hover:from-[#D9B574]/5 hover:to-[#C4A565]/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.course.name}</div>
                    <div className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-1">
                      {booking.course.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {booking.student.user.name?.charAt(0).toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.student.user.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{booking.student.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {booking.teacher.user.name?.charAt(0).toUpperCase() || 'T'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.teacher.user.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{booking.teacher.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                      booking.status === 'CONFIRMED' ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' :
                      booking.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white' :
                      booking.status === 'COMPLETED' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' :
                      booking.status === 'CANCELLED' ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' :
                      'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link 
                        href={`/${locale}/admin/bookings/${booking.id}`} 
                        className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/${locale}/admin/bookings/${booking.id}/edit`} 
                        className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg mb-6">No bookings found</p>
          <Link
            href={`/${locale}/admin/bookings/create`}
            className="inline-block px-8 py-4 bg-gradient-to-br from-[#D9B574] to-[#C4A565] text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
          >
            Create Your First Booking
          </Link>
        </div>
      )}
    </div>
  );
}
