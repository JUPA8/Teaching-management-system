import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';

export default async function PlatformLayout({
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

  return <>{children}</>;
}
