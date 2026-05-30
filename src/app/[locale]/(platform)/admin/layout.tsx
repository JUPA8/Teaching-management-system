import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-helpers';
import AdminLogoutButton from '@/components/platform/AdminLogoutButton';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect(`/${locale}/login?error=unauthorized`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-white to-[#E8F5F0]">
      {/* Islamic Pattern Background */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 20 L80 20 L65 35 L70 55 L50 45 L30 55 L35 35 L20 20 L40 20 Z' fill='none' stroke='%232B7A78' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="flex relative">
        {/* Islamic-Styled Sidebar — sticky, full-height, scrollable nav */}
        <aside className="w-72 h-screen sticky top-0 flex flex-col bg-gradient-to-b from-[#2B7A78] to-[#1d5856] shadow-2xl overflow-hidden flex-shrink-0">
          {/* Decorative Islamic Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Header — fixed at top, never scrolls */}
          <div className="relative p-8 border-b-2 border-[#D9B574]/30 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#D9B574] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🕌</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                <p className="text-[#D9B574] text-sm font-semibold">Salam Institute</p>
              </div>
            </div>
            {/* Decorative Islamic border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D9B574] to-transparent"></div>
          </div>

          {/* Navigation — scrollable section */}
          <nav className="flex-1 overflow-y-auto mt-6 px-4 space-y-2 relative pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {[
              { href: `/${locale}/admin`, label: 'Dashboard' },
              { href: `/${locale}/admin/users`, label: 'Users' },
              { href: `/${locale}/admin/courses`, label: 'Courses' },
              { href: `/${locale}/admin/bookings`, label: 'Bookings' },
              { href: `/${locale}/admin/payments`, label: 'Payments' },
              { href: `/${locale}/admin/probestunde`, label: 'Trial Requests' },
              { href: `/${locale}/admin/teachers`, label: 'Teachers' },
              { href: `/${locale}/admin/videos`, label: 'Videos' },
              { href: `/${locale}/admin/posts`, label: 'News & Announcements' },
              { href: `/${locale}/admin/settings`, label: 'Settings' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
              >
                <span className="font-semibold">{label}</span>
                <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
            ))}
          </nav>

          {/* Footer — fixed at bottom, never scrolls */}
          <div className="flex-shrink-0 p-4 space-y-3 border-t border-white/10">
            <AdminLogoutButton locale={locale} />
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-[#D9B574]/30">
              <p className="text-white/80 text-xs text-center font-arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <p className="text-[#D9B574] text-xs text-center mt-0.5">In the name of Allah</p>
            </div>
          </div>
        </aside>

        {/* Main content with Islamic border */}
        <main className="flex-1 p-8 relative">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78]"></div>
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
