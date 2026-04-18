'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function AdminLogoutButton({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-6 py-4 text-white/80 hover:bg-red-500/20 rounded-xl transition-all hover:translate-x-1 border border-white/0 hover:border-red-400/30 group disabled:opacity-50"
    >
      <LogOut className="w-4 h-4 text-red-300 group-hover:text-red-200" />
      <span className="font-semibold text-sm">{loading ? 'Signing out…' : 'Sign Out'}</span>
    </button>
  );
}
