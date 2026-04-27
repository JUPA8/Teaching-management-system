import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import UsersTableClient from './UsersTableClient';

export default async function AdminUsersPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
      isVerified: true,
    },
  });

  // Serialize dates so they can be passed as props to a client component
  const serialized = users.map((u: (typeof users)[number]) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] rounded-full" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent">
            Users Management
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/users/create`}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] transform group-hover:scale-105 transition-transform" />
          <div className="relative px-6 py-3">
            <span className="text-white font-bold">+ Create User</span>
          </div>
        </Link>
      </div>

      <UsersTableClient users={serialized} locale={locale} />
    </div>
  );
}
