import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';
import TeacherSidebar from '@/components/platform/TeacherSidebar';
import PlatformTopbar from '@/components/platform/PlatformTopbar';

export default async function TeacherLayout({
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

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PlatformTopbar user={session.user} locale={locale} />
      <div className="flex flex-1">
        <TeacherSidebar locale={locale} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
