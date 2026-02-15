import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminUsersPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      teacher: true,
      student: true,
    },
  });

  return (
    <div>
      {/* Islamic Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent">
            Users Management
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/users/create`}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] transform group-hover:scale-105 transition-transform"></div>
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Create User</span>
          </div>
        </Link>
      </div>

      {/* Islamic styled table container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        {/* Decorative header */}
        <div className="h-2 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78]"></div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gradient-to-r hover:from-[#2B7A78]/5 hover:to-[#D9B574]/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2B7A78] to-[#D9B574] rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{user.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                      user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white' :
                      user.role === 'TEACHER' ? 'bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white' :
                      'bg-gradient-to-r from-green-500 to-green-700 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Link 
                        href={`/${locale}/admin/users/${user.id}`} 
                        className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/${locale}/admin/users/${user.id}/edit`} 
                        className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
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

      {users.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg mb-6">No users found</p>
          <Link
            href={`/${locale}/admin/users/create`}
            className="inline-block px-8 py-4 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
          >
            Create Your First User
          </Link>
        </div>
      )}
    </div>
  );
}
