import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPaymentsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
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
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  return (
    <div>
      {/* Islamic Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-[#D9B574] bg-clip-text text-transparent">
            Payments Management
          </h1>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-sm opacity-50"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-green-500/30 shadow-xl">
            <div className="text-sm text-gray-600 font-semibold mb-1">Total Revenue</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              €{(totalRevenue._sum.amount || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Islamic styled table container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        {/* Decorative header */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-[#D9B574] to-purple-600"></div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-purple-50 to-[#D9B574]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Stripe ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {payments.map((payment, index) => (
                <tr 
                  key={payment.id}
                  className={`hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-[#D9B574]/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {payment.student.user.name?.charAt(0).toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{payment.student.user.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{payment.student.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      €{payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                      {payment.description || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                      payment.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' :
                      payment.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white' :
                      payment.status === 'FAILED' ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' :
                      'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {payment.stripePaymentIntentId ? (
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="font-mono text-xs text-gray-700">
                          {payment.stripePaymentIntentId.substring(0, 20)}...
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/${locale}/admin/payments/${payment.id}`} 
                      className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg">No payments found</p>
        </div>
      )}
    </div>
  );
}
