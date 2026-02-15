import { prisma } from '@/lib/prisma';
import AdminProbestundeClient from './client';

export default async function AdminProbestundePage() {
  const requests = await prisma.probestundeRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Convert to plain objects
  const plainRequests = requests.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    contactedAt: r.contactedAt?.toISOString() || null,
  }));

  return <AdminProbestundeClient initialRequests={plainRequests} />;
}
