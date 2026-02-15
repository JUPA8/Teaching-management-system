import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-helpers';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect(`/${params.locale}/login?error=unauthorized`);
  }

  const locale = params.locale;

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
        {/* Islamic-Styled Sidebar */}
        <aside className="w-72 min-h-screen bg-gradient-to-b from-[#2B7A78] to-[#1d5856] shadow-2xl relative overflow-hidden">
          {/* Decorative Islamic Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L40 25 L35 40 L25 40 L20 25 Z' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Header with Islamic Border */}
          <div className="relative p-8 border-b-2 border-[#D9B574]/30">
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

          {/* Navigation with Islamic styling */}
          <nav className="mt-6 px-4 space-y-2 relative">
            <a
              href={`/${locale}/admin`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Dashboard</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a
              href={`/${locale}/admin/users`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Users</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a
              href={`/${locale}/admin/courses`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Courses</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a
              href={`/${locale}/admin/bookings`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Bookings</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a
              href={`/${locale}/admin/payments`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Payments</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a
              href={`/${locale}/admin/probestunde`}
              className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:bg-white/10 rounded-xl transition-all hover:translate-x-1 backdrop-blur-sm border border-white/0 hover:border-[#D9B574]/30"
            >
              <span className="font-semibold">Trial Requests</span>
              <span className="ml-auto text-[#D9B574] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
          </nav>

          {/* Islamic Decorative Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-[#D9B574]/30">
              <p className="text-white/80 text-sm text-center font-arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <p className="text-[#D9B574] text-xs text-center mt-1">In the name of Allah</p>
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
