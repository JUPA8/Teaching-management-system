import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function UserDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      teacher: {
        include: {
          bookings: { take: 10, orderBy: { scheduledAt: 'desc' } },
        },
      },
      student: {
        include: {
          bookings: { take: 10, orderBy: { scheduledAt: 'desc' } },
          payments: { take: 10, orderBy: { createdAt: 'desc' } },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        <div className="flex gap-3">
          <Link
            href={`/${locale}/admin/users/${id}/edit`}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Edit User
          </Link>
          <Link
            href={`/${locale}/admin/users`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-gray-900 font-semibold">{user.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900 font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-gray-900 font-semibold">{user.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
          
          <div className="space-y-4">
            {user.student && (
              <>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-green-600">{user.student.bookings.length}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-600">{user.student.payments.length}</p>
                </div>
              </>
            )}
            
            {user.teacher && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Classes Taught</p>
                <p className="text-2xl font-bold text-purple-600">{user.teacher.bookings.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
