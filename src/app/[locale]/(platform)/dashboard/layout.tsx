import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';
import StudentSidebar from '@/components/platform/StudentSidebar';
import PlatformTopbar from '@/components/platform/PlatformTopbar';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // Only students (and admins who visit for testing) access this dashboard
  if (session.user.role === 'TEACHER') {
    redirect(`/${locale}/teacher`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PlatformTopbar user={session.user} locale={locale} />
      <div className="flex flex-1">
        <StudentSidebar locale={locale} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
